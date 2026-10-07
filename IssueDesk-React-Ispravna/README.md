# IssueDesk — React/Vite

IssueDesk je mala aplikacija za evidentiranje i obradu prijavljenih problema. Projekat je izrađen kao ispravna referentna verzija za eksperiment analize i ispravljanja grešaka u React i Vue aplikacijama.

## Funkcionalnosti

- prikaz i izbor prijava;
- pretraga po naslovu, opisu i odgovornoj osobi;
- filtriranje prema statusu i prioritetu;
- dodavanje i brisanje prijave;
- promena statusa;
- izračunavanje sažetih pokazatelja;
- asinhrona komunikacija sa simuliranim API-jem;
- prikaz stanja učitavanja i grešaka;
- periodično osvežavanje detalja izabrane prijave;
- prilagodljiv prikaz za manje ekrane.

Simulirani API čuva podatke u memoriji. Ponovno učitavanje stranice vraća početni skup podataka.

## Pokretanje

Potrebni su Node.js 22 ili noviji i npm.

```bash
npm install
npm run dev
```

Vite će u terminalu prikazati lokalnu adresu aplikacije.

## Provera

```bash
npm test
npm run build
```

Ova grana predstavlja ispravnu kontrolnu verziju. Za eksperiment se koristi njena kopija u koju se naknadno uvode unapred definisane greške. Kontrolna verzija se ne menja.
