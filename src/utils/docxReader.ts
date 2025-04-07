// import { readFile } from 'docx-preview';

// /**
//  * Reads a .docx file and extracts its text content.
//  * @param file - The .docx file to read.
//  * @returns A promise that resolves to the extracted text content.
//  */
// export const readDocxFile = async (file: File): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();

//     reader.onload = async (event) => {
//       try {
//         const arrayBuffer = event.target?.result as ArrayBuffer;
//         const textContent = await readFile(arrayBuffer);
//         resolve(textContent);
//       } catch (error) {
//         reject(error);
//       }
//     };

//     reader.onerror = () => {
//       reject(new Error('Error reading the file.'));
//     };

//     reader.readAsArrayBuffer(file);
//   });
// };

// /**
//  * Reads multiple .docx files and extracts their text content.
//  * @param files - An array of .docx files to read.
//  * @returns A promise that resolves to an array of extracted text contents.
//  */
// export const readMultipleDocxFiles = async (files: File[]): Promise<string[]> => {
//   const readFilePromises = files.map((file) => {
//     return new Promise<string>((resolve, reject) => {
//       const reader = new FileReader();

//       reader.onload = async (event) => {
//         try {
//           const arrayBuffer = event.target?.result as ArrayBuffer;
//           const textContent = await readFile(arrayBuffer);
//           resolve(textContent);
//         } catch (error) {
//           reject(error);
//         }
//       };

//       reader.onerror = () => {
//         reject(new Error(`Error reading the file: ${file.name}`));
//       };

//       reader.readAsArrayBuffer(file);
//     });
//   });

//   return Promise.all(readFilePromises);
// };

// /**
//  * Reads multiple .docx files from given file paths and extracts their text content.
//  * @param filePaths - An array of file paths to .docx files.
//  * @returns A promise that resolves to an array of extracted text contents.
//  */
// export const readMultipleDocxFilesFromPaths = async (filePaths: string[]): Promise<string[]> => {
//   const readFilePromises = filePaths.map((filePath) => {
//     return new Promise<string>((resolve, reject) => {
//       fetch(filePath)
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error(`Failed to fetch file at ${filePath}`);
//           }
//           return response.arrayBuffer();
//         })
//         .then((arrayBuffer) => readFile(arrayBuffer))
//         .then((textContent) => resolve(textContent))
//         .catch((error) => reject(error));
//     });
//   });

//   return Promise.all(readFilePromises);
// };
