import type { ChangeEvent } from "react";
import type { Deck, Card } from "../types/types";
import { createCard } from "../services/cardsService";

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

  function exportDecks(
    deckIds: string[]
  ) {

    if (deckIds.length === 0) {
      alert(
        "Selecione ao menos um deck."
      );

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
        type:
          "application/json"
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

  // =========================
  // IMPORT
  // =========================

  function importDecks(
    e: ChangeEvent<HTMLInputElement>
  ) {

    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = async () => {

      try {

        const data: ExportData = JSON.parse(reader.result as string);

        if (!data.decks || !data.cards) {
          alert("Arquivo inválido.");
          return;
        }

        // =========================
        // IMPORTA DECKS
        // =========================

        for (const deck of data.decks) {

          await fetch(
            "https://mymemo-reactandtypescript.onrender.com/decks",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json"
              },
              body: JSON.stringify(deck)
            }
          );
        }

        // =========================
        // IMPORTA CARDS
        // =========================

        for (const card of data.cards) {
          await createCard(card);
        }

        if (loadDecks) {
          await loadDecks();
        }

        alert("Importação concluída!");

      } catch (error) {

        console.error(error);

        alert("Erro ao importar arquivo.");
      }
    };

    reader.readAsText(file);
  }

  return {
    importDecks,
    exportDecks
  };
}