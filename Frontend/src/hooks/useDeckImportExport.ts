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
};

type ExportData = {
  version: number;
  exportedAt: number;
  decks: Deck[];
  cards: Card[];
};

export function useDeckImportExport({
  decks,
  cards,
  loadDecks
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
      Swal.fire({
        title: "Carregando...",
        text: "Importando decks e perguntas...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        const data: ExportData = JSON.parse(reader.result as string);

        if (!Array.isArray(data.decks) || !Array.isArray(data.cards)) {
          throw new Error("Arquivo inválido.");
        }

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
