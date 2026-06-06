const API_URL = "https://mymemo-reactandtypescript.onrender.com/ai";

export async function generateCardsFromPdf(
  file: File,
  questionCount: number
) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('questionCount', questionCount.toString());

    const response = await fetch(`${API_URL}/generate-from-pdf`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao processar PDF');
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao enviar PDF:", error);
    throw error;
  }
}
