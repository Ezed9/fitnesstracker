import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface MacroFormProps {
  onSubmit: (meal: {
    id: string
    name: string
    calories: number
    protein: number
    carbs: number
    fat: number
    time: string
  }) => void
  onCancel: () => void
  initialData?: {
    id: string
    name: string
    calories: number
    protein: number
    carbs: number
    fat: number
    time: string
  }
}

export function MacroForm({ onSubmit, onCancel, initialData }: MacroFormProps) {
  const [formData, setFormData] = useState({
    id: initialData?.id || uuidv4(),
    name: initialData?.name || '',
    calories: initialData?.calories || 0,
    protein: initialData?.protein || 0,
    carbs: initialData?.carbs || 0,
    fat: initialData?.fat || 0,
    time: initialData?.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'name' ? value : Number(value),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Meal Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Time
        </label>
        <input
          type="time"
          id="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 sm:text-sm"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="calories"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Calories
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              id="calories"
              name="calories"
              value={formData.calories}
              onChange={handleChange}
              min="0"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 sm:text-sm"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">kcal</span>
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="protein"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Protein
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              id="protein"
              name="protein"
              value={formData.protein}
              onChange={handleChange}
              min="0"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 sm:text-sm"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">g</span>
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="carbs"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Carbs
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              id="carbs"
              name="carbs"
              value={formData.carbs}
              onChange={handleChange}
              min="0"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 sm:text-sm"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">g</span>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="fat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Fat
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              id="fat"
              name="fat"
              value={formData.fat}
              onChange={handleChange}
              min="0"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 sm:text-sm"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">g</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
        >
          Save Meal
        </button>
      </div>
    </form>
  )
} 