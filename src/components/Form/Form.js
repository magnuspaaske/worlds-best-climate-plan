import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { FaCircleNotch, FaTimes } from 'react-icons/fa';
import classNames from 'classnames';
import Button from '../Button';

const FormField = ({ name, label, type = 'text', className, ...props }) => (
  <Field name={name}>
    {({
      field, // { name, value, onChange, onBlur }
      meta,
    }) => (
      <label className={className}>
        <p className="block text-green-700 mb-2">{label}</p>
        <input
          className={classNames(
            'w-full border-2 rounded-sm py-3 px-4 focus:border-green-500 bg-sand-100',
            {
              'border-red-700 mb-2': meta.touched && meta.error,
              'border-green-700 mb-4': !(meta.touched && meta.error),
            }
          )}
          type={type}
          {...field}
          {...props}
        />
        {meta.touched && meta.error && (
          <p className="text-red-500 text-s italic mb-3">{meta.error}</p>
        )}
      </label>
    )}
  </Field>
);

const SupportForm = ({ modal = false, closeModal, className }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(false);
  return (
    <section
      className={classNames(
        'mx-auto max-w-4xl p-8 py-16 rounded-sm bg-sand-100',
        className,
        {
          'h-full overflow-auto sm:h-auto': modal,
        }
      )}
    >
      <div className="mx-auto max-w-lg">
        <Formik
          initialValues={{
            email: '',
            firstname: '',
            lastname: '',
            zip: '',
          }}
          validate={values => {
            const errors = {};
            if (!values.firstname) {
              errors.firstname = 'Dette felt er påkrævet';
            }
            if (!values.lastname) {
              errors.lastname = 'Dette felt er påkrævet';
            }
            if (!values.email) {
              errors.email = 'Dette felt er påkrævet';
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = 'E-mail adressen ser ugyldig ud';
            }
            const zipNum = parseInt(values.zip, 10);
            if (
              isNaN(zipNum) ||
              values.zip.length !== 4 ||
              zipNum > 9999 ||
              zipNum < 0
            ) {
              errors.zip = 'Postnummeret skal bestå af 4 tal';
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setError(false);
            fetch(
              'https://us-central1-boxwood-academy-251913.cloudfunctions.net/addRecipient',
              { method: 'POST', body: new URLSearchParams(values) }
            )
              .then(res => res.json())
              .then(res => {
                if (res.err) {
                  setError(true);
                } else {
                  setIsSubmitted(true);
                }
                setSubmitting(false);
              })
              .catch(() => {
                setError(true);
                setSubmitting(false);
              });
          }}
        >
          {({ isSubmitting }) => (
            <Form className="md:max-w-2xl mx-auto">
              {isSubmitted && !error && (
                <div>
                  <h2 className="text-xl font-bold mb-4 sm:text-2xl sm:text-center">
                    Tak for hjælpen
                  </h2>
                  <p className="mb-3 sm:mb-8 sm:text-center">
                    Husk at tjekke din mail og bekræfte din tilmeldelse.
                  </p>
                </div>
              )}
              {(!isSubmitted || error) && (
                <React.Fragment>
                  <h2 className="text-xl font-bold mb-4 sm:text-2xl sm:text-center">
                    Følg med og hjælp til
                  </h2>
                  <p className="mb-3 text-sm sm:text-base sm:mb-8 sm:text-center">
                    Borgerforslaget er første skridt i at indføre retfærdige klimaafgifter i Danmark. Skriv dig op til nyheder og støt
                    kampen for at løse klimakrisen på den mest effektive og
                    socialt retfærdige måde.
                  </p>
                  {error && (
                    <div
                      className="border-2 text-red-700 border-red-700 px-4 py-3 rounded-sm mb-4 sm:mb-8"
                      role="alert"
                    >
                      <span>Noget gik galt. Prøv ventligst igen</span>
                    </div>
                  )}
                  <div className="sm:flex sm:-mx-2">
                    <FormField
                      className="w-full sm:w-1/2 sm:mx-2"
                      name="firstname"
                      label="Fornavn"
                    />
                    <FormField
                      className="w-full sm:w-1/2 sm:mx-2"
                      name="lastname"
                      label="Efternavn"
                    />
                  </div>
                  <div className="sm:flex sm:-mx-2 mb-8">
                    <FormField
                      className="w-full sm:w-2/3 sm:mx-2"
                      name="email"
                      type="email"
                      label="Email"
                    />
                    <FormField
                      className="w-full sm:w-1/3 sm:mx-2"
                      name="zip"
                      label="Postnummer"
                      maxLength={4}
                    />
                  </div>
                  {isSubmitting ? (
                    <div className="text-4xl text-green-500 sm:flex sm:justify-center">
                      <FaCircleNotch
                        style={{ animation: 'spin 1s infinite ease-in-out' }}
                      />
                    </div>
                  ) : (
                    <Button type="submit" large className="block sm:mx-auto">
                      Skriv dig op&nbsp;&nbsp;📮
                    </Button>
                  )}
                  {/* 
                  ADD THIS WHEN WE HAVE A LINK TO THE BORGERFORSLAG
                  {!modal && (
                    <p className="mt-8 text-center">
                      Pssst ... har du husket at skrive under på{' '}
                      <a
                        href="/"
                        target="_blank"
                        rel="noopener"
                        className="underline text-green-700 hover:text-green-500"
                      >
                        borgerforslaget
                      </a>
                      ?
                    </p>
                  )}
                  */}
                </React.Fragment>
              )}
              {modal && (
                <button
                  type="button"
                  className="absolute top-0 right-0 cursor-pointer text-xl text-sand-700 hover:text-sand-800 transition ease-in-out duration-200 m-6 sm:m-8"
                  onClick={closeModal}
                >
                  <FaTimes />
                </button>
              )}
              {modal && (
                <span
                  className="block my-3 sm:mt-6 cursor-pointer sm:hidden"
                  onClick={closeModal}
                >
                  Luk vinduet
                </span>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};

export default SupportForm;
