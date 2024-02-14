// import OpenAI from "openai";
// const openai = new OpenAI();

// // export async function getEmbeddings(text: string) {
// //   try {
// //     const response = await openai.createEmbedding({
// //       model: "text-embedding-ada-002",
// //       input: text.replace(/\n/g, " "),
// //     });
// //     const result = await response.json();
// //     return result.data[0].embedding as number[];
// //   } catch (error) {
// //     console.log("error calling openai embeddings api", error);
// //     throw error;
// //   }
// // }

// export async function getEmbeddings(text:string) {
//   console.log("Embeding Function Called:",text);
  
//   try {
//     const response = await openai.embeddings.create({
//       model: "text-embedding-3-small",
//       input: text.replace(/\n/g, " "),
      
//     });
//     return response.data[0].embedding;
//   } catch (error) {
//     console.error("Error calling OpenAI embeddings API:", error);
//     throw error;
//   }
// }


import OpenAI from "openai";

export async function getEmbeddings(text: string) {
  // Securely retrieve API key from environment variable
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY environment variable. Please set it securely.");
  }

  // Create OpenAI instance using the retrieved API key
  const openai = new OpenAI();

  try {
    // Call the embeddings.create method with recommended settings
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002", // Use the recommended model for embeddings
      input: text.replace(/\n/g, " "), // Ensure consistent newline handling
      // max_token: 15, // Limit input length to 15 tokens (recommended for efficiency)
      // stop: ["[SEP]"], // Include stop sequence for proper model handling
    });

    // Return the embedding vector
    return response.data[0].embedding;
  } catch (error) {
    // Handle errors gracefully
    console.error("Error calling OpenAI embeddings API:", error);
    return null; // Or implement appropriate error handling
  }
}
