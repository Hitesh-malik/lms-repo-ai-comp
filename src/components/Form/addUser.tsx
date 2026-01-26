import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import FormInput from "../Common/FormInput";

export interface UserAuthFormValues {
  username: string;
  email: string;
  password: string;
}

interface UserAuthFormProps {
  initialValues?: UserAuthFormValues | null;
  onSubmit: (
    values: UserAuthFormValues,
    formikHelpers: FormikHelpers<UserAuthFormValues>
  ) => void | Promise<void>;
}

export default function UserAuthForm({ 
  onSubmit,
  initialValues: initialValuesProp 
}: UserAuthFormProps) {
  const initialValues: UserAuthFormValues = initialValuesProp || {
    username: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize // Important: allows form to update when initialValues change
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6 max-w-md mx-auto p-4">
          <FormInput
            name="username"
            label="Username"
            placeholder="Enter your username"
          />

          <FormInput
            name="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
          />

          <FormInput
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="
              mt-8 w-full
              bg-slate-800 hover:bg-slate-900
              text-white text-sm font-medium
              py-2 rounded
              disabled:opacity-60
            "
          >
            {isSubmitting ? "Creating User..." : "Create User"}
          </button>
        </Form>
      )}
    </Formik>
  );
}