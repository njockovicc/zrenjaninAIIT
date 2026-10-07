export const seedIssues = [
  {
    id: 101,
    title: 'Neuspešna prijava korisnika',
    description:
      'Korisnik nakon unosa ispravnih pristupnih podataka ostaje na stranici za prijavu.',
    status: 'open',
    priority: 'high',
    owner: 'Ana',
    createdAt: '2026-09-02T08:15:00.000Z',
    updatedAt: '2026-09-02T08:15:00.000Z',
  },
  {
    id: 102,
    title: 'Duplirani zapisi u izveštaju',
    description:
      'Mesečni izveštaj povremeno prikazuje isti zapis dva puta nakon osvežavanja podataka.',
    status: 'in-progress',
    priority: 'medium',
    owner: 'Marko',
    createdAt: '2026-09-01T13:40:00.000Z',
    updatedAt: '2026-09-02T07:25:00.000Z',
  },
  {
    id: 103,
    title: 'Pogrešna oznaka statusa',
    description:
      'Zatvorena prijava je u tabelarnom prikazu bila označena kao prijava u obradi.',
    status: 'closed',
    priority: 'low',
    owner: 'Jelena',
    createdAt: '2026-08-30T09:05:00.000Z',
    updatedAt: '2026-09-01T16:10:00.000Z',
  },
  {
    id: 104,
    title: 'Kašnjenje pri učitavanju profila',
    description:
      'Podaci korisničkog profila učitavaju se duže od očekivanog pri prvom otvaranju stranice.',
    status: 'open',
    priority: 'high',
    owner: 'Nikola',
    createdAt: '2026-08-29T11:30:00.000Z',
    updatedAt: '2026-08-31T10:45:00.000Z',
  },
  {
    id: 105,
    title: 'Izvoz podataka nije dostupan',
    description:
      'Dugme za izvoz podataka nije aktivno kada je izabran prilagođeni vremenski period.',
    status: 'open',
    priority: 'medium',
    owner: 'Mina',
    createdAt: '2026-08-28T14:20:00.000Z',
    updatedAt: '2026-08-30T12:05:00.000Z',
  },
]
