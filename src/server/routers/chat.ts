import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { TRPCError } from "@trpc/server";

// Initialize AI clients
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chatRouter = router({
  sendMessage: publicProcedure
    .input(
      z.object({
        message: z.string().min(1, "Message cannot be empty"),
        model: z.enum(["gemini", "openai"]),
        generateImage: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // No user check for now
        const { message, model, generateImage } = input;
        console.log(
          `Processing message with model: ${model}, generateImage: ${generateImage}`
        );

        if (model === "gemini") {
          try {
            console.log(
              "Initializing Gemini API with key:",
              process.env.GEMINI_API_KEY?.slice(0, 5) + "..."
            );

            const geminiModel = genAI.getGenerativeModel({
              model: "gemini-pro", // Reverting to original model name
            });

            console.log("Sending message to Gemini:", message);
            const result = await geminiModel.generateContent(message);
            console.log("Received response from Gemini");

            const response = await result.response;
            const text = response.text();
            console.log("Successfully processed Gemini response");

            if (generateImage) {
              try {
                const imageModel = genAI.getGenerativeModel({
                  model: "gemini-pro-vision",
                });
                const imagePrompt = `Generate an image based on this description: ${message}`;
                const imageResult = await imageModel.generateContent(
                  imagePrompt
                );
                const imageResponse = await imageResult.response;

                return {
                  text,
                  image: imageResponse.text(),
                };
              } catch (imageError) {
                console.error(
                  "Error generating image with Gemini:",
                  imageError
                );
                return {
                  text,
                  image: null,
                  error: "Failed to generate image",
                };
              }
            }

            return { text };
          } catch (geminiError) {
            console.error("Detailed Gemini API Error:", {
              name: geminiError instanceof Error ? geminiError.name : "Unknown",
              message:
                geminiError instanceof Error
                  ? geminiError.message
                  : "Unknown error",
              stack:
                geminiError instanceof Error ? geminiError.stack : undefined,
            });

            // Check for specific error types
            if (geminiError instanceof Error) {
              if (geminiError.message.includes("API key not valid")) {
                throw new TRPCError({
                  code: "UNAUTHORIZED",
                  message:
                    "Invalid Gemini API key. Please check your API key configuration.",
                  cause: geminiError,
                });
              }

              if (
                geminiError.message.includes("not found") ||
                geminiError.message.includes("not supported")
              ) {
                throw new TRPCError({
                  code: "BAD_REQUEST",
                  message:
                    "Gemini model not available. Please check your API key permissions and model access.",
                  cause: geminiError,
                });
              }
            }

            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message:
                "Failed to generate response with Gemini. Please check the server logs for details.",
              cause: geminiError,
            });
          }
        } else {
          try {
            const completion = await openai.chat.completions.create({
              messages: [{ role: "user", content: message }],
              model: "gpt-3.5-turbo",
            });

            if (generateImage) {
              try {
                const imageResponse = await openai.images.generate({
                  prompt: message,
                  n: 1,
                  size: "512x512",
                });

                return {
                  text: completion.choices[0].message.content,
                  image: imageResponse.data?.[0]?.url ?? null,
                };
              } catch (imageError) {
                console.error(
                  "Error generating image with OpenAI:",
                  imageError
                );
                return {
                  text: completion.choices[0].message.content,
                  image: null,
                  error: "Failed to generate image",
                };
              }
            }

            return {
              text: completion.choices[0].message.content,
            };
          } catch (openaiError) {
            console.error("Error with OpenAI API:", openaiError);
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to generate response with OpenAI",
            });
          }
        }
      } catch (error) {
        console.error("Error in sendMessage:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
        });
      }
    }),
});
