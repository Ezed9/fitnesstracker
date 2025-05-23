export interface SignupFormProps {
  onSubmit: (email: string, password: string) => Promise<void>
  error?: string
  loading: boolean
}

export interface FeatureSectionProps {
  // Add any props needed for FeatureSection if any
}
