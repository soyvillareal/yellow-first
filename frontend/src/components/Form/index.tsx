import { FieldValues, FormProvider } from "react-hook-form";

import { IFormProps } from "./Form.types";

const Form = <T extends FieldValues>({
  className,
  autoComplete = "on",
  onSubmit,
  methods,
  children,
}: React.PropsWithChildren<IFormProps<T>>) => {
  return (
    <FormProvider {...methods}>
      <form
        className={className}
        autoComplete={autoComplete}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        {children}
      </form>
    </FormProvider>
  );
};

export default Form;
