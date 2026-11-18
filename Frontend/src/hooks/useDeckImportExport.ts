import type { ChangeEvent } from "react";
import type { Deck, Card } from "../types/types";
import { createCard } from "../services/cardsService";
import { createDeck, getDecks } from "../services/decksService";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";

type UseDeckImportExportProps = {
  decks: Deck[];
  cards: Card[];
  loadDecks?: () => Promise<void>;
  onImportSuccess?: () => void | Promise<void>;
};

type ExportData = {
  version: number;
  exportedAt: number;
  decks: Deck[];
  cards: Card[];
};

function parseExportData(content: string): ExportData {
  let data: unknown;

  try {
    data = JSON.parse(content);
  } catch (error) {
    const positionMatch =
      error instanceof SyntaxError
        ? error.message.match(/position\s+(\d+)/i)
        : null;
    let location = "";

    if (positionMatch) {
      const position = Math.min(Number(positionMatch[1]), content.length);
      const precedingText = content.slice(0, position);
      const line = precedingText.split("\n").length;
      const column = position - precedingText.lastIndexOf("\n");
      location = ` Próximo à linha ${line}, coluna ${column}.`;
    }

    throw new Error(
      `O arquivo não é um JSON válido.${location} Verifique se há vírgulas, chaves ou colchetes faltando.`,
    );
  }

  if (
    !data ||
    typeof data !== "object" ||
    Array.isArray(data) ||
    !Array.isArray((data as Record<string, unknown>).decks) ||
    !Array.isArray((data as Record<string, unknown>).cards)
  ) {
    throw new Error("Arquivo inválido: ele deve conter listas de decks e cards.");
  }

  return data as ExportData;
}

export function useDeckImportExport({
  decks,
  cards,
  loadDecks,
  onImportSuccess
}: UseDeckImportExportProps) {
  function exportDecks(deckIds: string[]) {
    if (deckIds.length === 0) {
      alert("Selecione ao menos um deck.");
      return;
    }

    const decksToExport =
      decks.filter(d =>
        deckIds.includes(d.id)
      );

    const cardsToExport =
      cards.filter(c =>
        deckIds.includes(c.deck_id)
      );

    const exportData: ExportData = {
      version: 1,
      exportedAt: Date.now(),
      decks: decksToExport,
      cards: cardsToExport
    };

    const blob = new Blob(
      [
        JSON.stringify(exportData, null, 2)
      ],
      {
        type: "application/json"
      }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download =
      `${decksToExport[0]?.name ?? "deck"}.json`;

    a.click();

    URL.revokeObjectURL(url);
  }

  function importDecks(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        if (typeof reader.result !== "string") {
          throw new Error("Não foi possível ler o arquivo selecionado.");
        }
        const data = parseExportData(reader.result);

        Swal.fire({
          title: "Carregando...",
          text: "Importando decks e perguntas...",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        await getDecks();

        const importedDeckIds = new Map<string, string>();

        for (const deck of data.decks) {
          const newDeckId = uuidv4();

          importedDeckIds.set(deck.id, newDeckId);

          await createDeck({
            ...deck,
            id: newDeckId
          });
        }

        for (const card of data.cards) {
          const newDeckId = importedDeckIds.get(card.deck_id);

          if (!newDeckId) {
            throw new Error("Arquivo inválido: card sem deck correspondente.");
          }

          await createCard({
            ...card,
            id: uuidv4(),
            deck_id: newDeckId
          });
        }

        if (loadDecks) {
          await loadDecks();
        }

        await onImportSuccess?.();

        Swal.close();
        await Swal.fire({
          title: "Sucesso!",
          text: "Deck importado com sucesso.",
          icon: "success",
          background: "#1E1E1E",
          color: "#fff"
        });
      } catch (error) {
        console.error(error);

        Swal.close();
        await Swal.fire({
          title: "Erro",
          text: error instanceof Error ? error.message : "Erro ao importar Deck",
          icon: "error",
          confirmButtonText: "OK",
          showConfirmButton: true,
          background: "#1E1E1E",
          color: "#fff"
        });
      } finally {
        e.target.value = "";
      }
    };

    reader.readAsText(file);
  }

  return {
    importDecks,
    exportDecks
  };
}
