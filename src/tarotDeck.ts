export type TarotCard = {
  id: string
  name: string
  arcana: 'major' | 'minor'
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles'
  number?: number
  imageUrl: string
}

// Временная колода с заглушечными изображениями.
// Позже сюда можно подставить реальные арты и расширить до 78 карт.
export const tarotDeck: TarotCard[] = [
  {
    id: 'major_06_lovers',
    name: 'Влюблённые',
    arcana: 'major',
    number: 6,
    imageUrl:
      'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'major_02_high_priestess',
    name: 'Верховная жрица',
    arcana: 'major',
    number: 2,
    imageUrl:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'major_07_chariot',
    name: 'Колесница',
    arcana: 'major',
    number: 7,
    imageUrl:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'swords_09',
    name: '9 мечей',
    arcana: 'minor',
    suit: 'swords',
    number: 9,
    imageUrl:
      'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=800&q=80',
  },
]

export function getRandomCard(): TarotCard {
  return tarotDeck[Math.floor(Math.random() * tarotDeck.length)]
}

export function getRandomSubset(count: number): TarotCard[] {
  const shuffled = [...tarotDeck].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

