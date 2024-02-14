import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import md5 from "md5";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";
import { convertToAscii } from "./utils";

export const getPineconeClient = () => {
  return new Pinecone({
    
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export async function loadS3IntoPinecone(fileKey: string) {
  try {
    // 1. Obtain the PDF -> download and read from PDF
    console.log("Downloading S3 into the file system");
    const fileName = await downloadFromS3(fileKey);

    if (!fileName) {
      throw new Error("Could not download from S3");
    }

    console.log("Loading PDF into memory: " + fileName);
    const loader = new PDFLoader(fileName);
    const pages = (await loader.load()) as PDFPage[];

    // 2. Split and segment the PDF
    const documents = await Promise.all(pages.map(prepareDocument));

    // 3. Vectorize and embed individual documents
    const vectors = await Promise.all(documents.flat().map(embedDocument));

    // 4. Upload to Pinecone
    const client = await getPineconeClient();
    const pineconeIndex = await client.index("uzair");
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

    console.log("Inserting vectors into Pinecone");
    await namespace.upsert(vectors);

    return documents[0];
  } catch (error) {
    console.error("Error loading S3 into Pinecone:", error);
    throw error;
  }
}

async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (error) {
    console.error("Error embedding document", error);
    throw error;
  }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, "");

  // Split the docs
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);

  return docs;
}
