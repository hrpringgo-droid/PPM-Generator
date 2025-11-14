export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remove the data:image/png;base64, prefix
      resolve(base64String.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};
