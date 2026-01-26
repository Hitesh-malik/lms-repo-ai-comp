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
        <Form className="w-full max-w-md mx-auto">
          {/* Heading Section */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Create New User
            </h2>
            <p className="text-sm text-slate-500">
              Fill in the details below to add a new sub-admin user
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
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
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              mt-8 w-full
              bg-gradient-to-r from-slate-800 to-slate-900
              hover:from-slate-900 hover:to-slate-950
              text-white text-sm font-semibold
              py-3 px-4 rounded-lg
              shadow-lg hover:shadow-xl
              transition-all duration-200
              disabled:opacity-60 disabled:cursor-not-allowed
              transform hover:scale-[1.02] active:scale-[0.98]
            "
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating User...
              </span>
            ) : (
              "Create User"
            )}
          </button>
        </Form>
      )}
    </Formik>
  );
}