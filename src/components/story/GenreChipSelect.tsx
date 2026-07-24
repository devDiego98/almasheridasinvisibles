import { GENRES, MAX_GENRES } from '../../types/story'
import { Chip } from '../ui/Chip'

interface GenreChipSelectProps {
  value: string[]
  onChange: (genres: string[]) => void
}

export function GenreChipSelect({ value, onChange }: GenreChipSelectProps) {
  function toggle(genre: string) {
    if (value.includes(genre)) {
      onChange(value.filter((g) => g !== genre))
    } else if (value.length < MAX_GENRES) {
      onChange([...value, genre])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {GENRES.map((genre) => (
        <Chip key={genre} selected={value.includes(genre)} onClick={() => toggle(genre)}>
          {genre}
        </Chip>
      ))}
    </div>
  )
}
