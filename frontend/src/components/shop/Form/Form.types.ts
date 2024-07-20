import { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';

export interface IFormProps<T extends FieldValues> {
  className?: string;
  autoComplete?: string;
  onSubmit: SubmitHandler<T>;
  methods: UseFormReturn<T>;
}
