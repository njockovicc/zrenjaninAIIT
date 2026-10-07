# zrenjaninAIIT
# IssueDesk – E5 eksperiment testiranja AI alata za ispravljanje koda

Ovaj repozitorijum sadrži izvorni kod korišćen u okviru **E5 eksperimenta**, sprovedenog radi uporedne analize AI alata za generisanje i ispravljanje programskog koda.

Eksperiment je usmeren na poređenje sposobnosti alata **Claude** i **Codex** da pronađu i isprave veći broj međusobno povezanih grešaka u postojećoj veb aplikaciji.

## Opis eksperimenta

Za potrebe E5 eksperimenta korišćena je aplikacija **IssueDesk**, namenjena jednostavnom upravljanju prijavljenim problemima.

Aplikacija omogućava:

- prikaz liste problema,
- pretragu i filtriranje problema,
- pregled detalja izabranog problema,
- dodavanje i brisanje problema,
- promenu statusa problema,
- prikaz statistike,
- automatsko osvežavanje određenih podataka.

Za razliku od jednostavnijih eksperimenata sa izolovanim greškama, E5 je osmišljen tako da sadrži **više međusobno povezanih problema u kodu**.

Cilj eksperimenta bio je da se ispita koliko uspešno AI alati mogu da analiziraju postojeću aplikaciju, pronađu uzroke problema i izvrše potrebne izmene bez narušavanja funkcionalnosti ostalih delova sistema.

## Testirani AI alati

Za ispravljanje iste početne verzije aplikacije korišćeni su:

- **Claude**
- **Codex**

Oba alata dobijala su isti ili ekvivalentan početni programski kod i opis očekivanog ponašanja aplikacije.

Dobijene verzije zatim su testirane korišćenjem unapred definisanih test scenarija.

## Uvedene greške

Početna verzija aplikacije sadrži više namerno uvedenih problema, među kojima su:

- kašnjenje ili nepravilno ponašanje pretrage,
- problemi sa konkurentnim asinhronim zahtevima,
- statistika koja se ne ažurira pravilno,
- direktna mutacija stanja aplikacije,
- izvršavanje asinhronih operacija nakon uklanjanja komponente,
- problemi koji nastaju kombinovanjem dodavanja, filtriranja, brisanja i izmene problema,
- dodatne greške vezane za pojedinačne komponente aplikacije.

Greške su namerno kombinovane kako bi se dobio složeniji i realističniji scenario otklanjanja problema, u kojem izmena jednog dela aplikacije može uticati na ponašanje drugih funkcionalnosti.

## Način evaluacije

Rešenja generisana pomoću AI alata proveravana su korišćenjem šest unapred definisanih test scenarija (**T1–T6**).

Testovi obuhvataju funkcionalnosti kao što su:

- pretraga problema,
- ponašanje aplikacije kada pretraga ne vrati rezultate,
- promena statusa problema,
- brisanje problema,
- automatsko osvežavanje podataka,
- kombinovani scenario sa više uzastopnih korisničkih akcija.

Na ovaj način nije proveravano samo da li je pojedinačna greška ispravljena, već i da li aplikacija ostaje funkcionalno ispravna kada više funkcionalnosti međusobno zavisi jedna od druge.

## Sadržaj repozitorijuma

Repozitorijum sadrži verzije programskog koda korišćene tokom E5 eksperimenta, uključujući:

- početnu verziju IssueDesk aplikacije sa namerno uvedenim greškama,
- verzije dobijene nakon AI analize i ispravki,
- verzije koje je modifikovao Claude,
- verzije koje je modifikovao Codex.

Različite verzije sačuvane su odvojeno kako bi se omogućilo poređenje promena koje su napravili testirani AI alati.

## Korišćene tehnologije

U okviru eksperimenta korišćene su sledeće tehnologije:

- JavaScript
- React
- Vue
- Vite
- Axios
- Node.js
- npm

## Svrha repozitorijuma

Ovaj repozitorijum predstavlja prateći materijal eksperimentalnog dela rada u kojem se analiziraju mogućnosti i ograničenja generativnih AI alata prilikom otkrivanja i ispravljanja grešaka u programskom kodu.

E5 eksperiment posebno je usmeren na složeniji scenario sa **više međusobno povezanih grešaka**, čime se omogućava poređenje ponašanja alata Claude i Codex pod istim ili uporedivim eksperimentalnim uslovima.
