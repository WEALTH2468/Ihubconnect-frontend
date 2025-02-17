import * as yup from 'yup';

const contactFormSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email must be a valid email')
    .required('Email is required'),
  firstName: yup
    .string()
    .required('First Name is required')
    .min(4, 'Name must be at least 4 characters long'),
  lastName: yup
    .string()
    .required('Last Name is required')
    .min(4, 'Name must be at least 4 characters long'),
  birthDay: yup.date(),
  contactOwner: yup.string().required('Contact Owner is required'),
  company: yup.string().required(),
  jobTitle: yup.string().notRequired(),
  phoneNumber: yup.string().notRequired(),
  department: yup.string().notRequired(),
  twitter: yup.string().notRequired(),
  linkedin: yup.string().notRequired(),
  industry: yup.string().required(),
  address: yup.string().notRequired(),
  city: yup.string().notRequired(),
  zipCode: yup.string().notRequired(),
  state: yup.string().notRequired(),
  country: yup.string().notRequired(),
  permanentAddress: yup.string().notRequired(),
  permanentCity: yup.string().notRequired(),
  permanentZipCode: yup.string().notRequired(),
  permanentState: yup.string().notRequired(),
  permanentCountry: yup.string().notRequired(),
  contactStage: yup.string().required('Contact stage is required'),
});

export default contactFormSchema;
