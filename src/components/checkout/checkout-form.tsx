// import Input from '@components/ui/input';
// import { useForm } from 'react-hook-form';
// import TextArea from '@components/ui/text-area';
// import { useCheckoutMutation } from '@framework/checkout/use-checkout';
// import { CheckBox } from '@components/ui/checkbox';
// import Button from '@components/ui/button';
// import Router from 'next/router';
// import { ROUTES } from '@utils/routes';
// import { useTranslation } from 'next-i18next';
// import { useDeliveryCharge } from '@framework/delivery-charge';

// interface CheckoutInputType {
//   firstName: string;
//   lastName: string;
//   phone: string;
//   email: string;
//   address: string;
//   city: string;
//   zipCode: string;
//   save: boolean;
//   note: string;
// }

// const CheckoutForm: React.FC = () => {
//   const { data: deliveryCharge } = useDeliveryCharge();
//   console.log("deliveryCharge", deliveryCharge);
//   const { t } = useTranslation();
//   const { mutate: updateUser, isPending } = useCheckoutMutation();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<CheckoutInputType>();
//   function onSubmit(input: CheckoutInputType) {
//     updateUser(input);
//     Router.push(ROUTES.ORDER);
//   }

//   return (
//     <>
//       <h2 className="text-lg md:text-xl xl:text-2xl font-bold text-heading mb-6 xl:mb-8">
//         {t('text-shipping-address')}
//       </h2>
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="w-full mx-auto flex flex-col justify-center "
//         noValidate
//       >
//         <div className="flex flex-col space-y-4 lg:space-y-5">
//           <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0">
//             <Input
//               labelKey="forms:label-first-name"
//               {...register('firstName', {
//                 required: 'forms:first-name-required',
//               })}
//               errorKey={errors.firstName?.message}
//               variant="solid"
//               className="w-full lg:w-1/2 "
//             />
//             <Input
//               labelKey="forms:label-last-name"
//               {...register('lastName', {
//                 required: 'forms:last-name-required',
//               })}
//               errorKey={errors.lastName?.message}
//               variant="solid"
//               className="w-full lg:w-1/2 ltr:lg:ml-3 rtl:lg:mr-3 mt-2 md:mt-0"
//             />
//           </div>
//           <Input
//             labelKey="forms:label-address"
//             {...register('address', {
//               required: 'forms:address-required',
//             })}
//             errorKey={errors.address?.message}
//             variant="solid"
//           />
//           <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0">
//             <Input
//               type="tel"
//               labelKey="forms:label-phone"
//               {...register('phone', {
//                 required: 'forms:phone-required',
//               })}
//               errorKey={errors.phone?.message}
//               variant="solid"
//               className="w-full lg:w-1/2 "
//             />

//             <Input
//               type="email"
//               labelKey="forms:label-email-star"
//               {...register('email', {
//                 required: 'forms:email-required',
//                 pattern: {
//                   value:
//                     /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
//                   message: 'forms:email-error',
//                 },
//               })}
//               errorKey={errors.email?.message}
//               variant="solid"
//               className="w-full lg:w-1/2 ltr:lg:ml-3 rtl:lg:mr-3 mt-2 md:mt-0"
//             />
//           </div>
//           <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0">
//             <Input
//               labelKey="forms:label-city"
//               {...register('city')}
//               variant="solid"
//               className="w-full lg:w-1/2 "
//             />

//             <Input
//               labelKey="forms:label-postcode"
//               {...register('zipCode')}
//               variant="solid"
//               className="w-full lg:w-1/2 ltr:lg:ml-3 rtl:lg:mr-3 mt-2 md:mt-0"
//             />
//           </div>
//           <div className="relative flex items-center ">
//             <CheckBox labelKey="forms:label-save-information" />
//           </div>
//           <TextArea
//             labelKey="forms:label-order-notes"
//             {...register('note')}
//             placeholderKey="forms:placeholder-order-notes"
//             className="relative pt-3 xl:pt-6"
//           />
//           <div className="flex w-full">
//             <Button
//               className="w-full sm:w-auto"
//               loading={isPending}
//               disabled={isPending}
//             >
//               {t('common:button-place-order')}
//             </Button>
//           </div>
//         </div>
//       </form>
//     </>
//   );
// };

// export default CheckoutForm;


import Input from '@components/ui/input';
import { useForm } from 'react-hook-form';
import TextArea from '@components/ui/text-area';
import { useCheckoutMutation } from '@framework/checkout/use-checkout';
import { CheckBox } from '@components/ui/checkbox';
import Button from '@components/ui/button';
import Router from 'next/router';
import { ROUTES } from '@utils/routes';
import { useTranslation } from 'next-i18next';
import { useDeliveryCharge } from '@framework/delivery-charge';
import { useEffect } from 'react';

interface CheckoutInputType {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  save: boolean;
  note: string;
}

interface CheckoutFormProps {
  onCityChange: (city: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onCityChange }) => {
  const { data: deliveryCharge } = useDeliveryCharge();
  const { t } = useTranslation();
  const { mutate: updateUser, isPending } = useCheckoutMutation();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutInputType>();

  const cityValue = watch('city');

  // Update parent component when city changes
  useEffect(() => {
    if (cityValue) {
      onCityChange(cityValue);
    }
  }, [cityValue, onCityChange]);

  function onSubmit(input: CheckoutInputType) {
    updateUser(input);
    Router.push(ROUTES.ORDER);
  }

  return (
    <>
      <h2 className="text-lg md:text-xl xl:text-2xl font-bold text-heading mb-6 xl:mb-8">
        {t('text-shipping-address')}
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mx-auto flex flex-col justify-center "
        noValidate
      >
        <div className="flex flex-col space-y-4 lg:space-y-5">
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0">
            <Input
              labelKey="forms:label-first-name"
              {...register('firstName', {
                required: 'forms:first-name-required',
              })}
              errorKey={errors.firstName?.message}
              variant="solid"
              className="w-full lg:w-1/2 "
            />
            <Input
              labelKey="forms:label-last-name"
              {...register('lastName', {
                required: 'forms:last-name-required',
              })}
              errorKey={errors.lastName?.message}
              variant="solid"
              className="w-full lg:w-1/2 ltr:lg:ml-3 rtl:lg:mr-3 mt-2 md:mt-0"
            />
          </div>
          <Input
            labelKey="forms:label-address"
            {...register('address', {
              required: 'forms:address-required',
            })}
            errorKey={errors.address?.message}
            variant="solid"
          />
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0">
            <Input
              type="tel"
              labelKey="forms:label-phone"
              {...register('phone', {
                required: 'forms:phone-required',
              })}
              errorKey={errors.phone?.message}
              variant="solid"
              className="w-full lg:w-1/2 "
            />

            <Input
              type="email"
              labelKey="forms:label-email-star"
              {...register('email', {
                required: 'forms:email-required',
                pattern: {
                  value:
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: 'forms:email-error',
                },
              })}
              errorKey={errors.email?.message}
              variant="solid"
              className="w-full lg:w-1/2 ltr:lg:ml-3 rtl:lg:mr-3 mt-2 md:mt-0"
            />
          </div>
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0">
            <div className="w-full lg:w-1/2">
              <label className="block text-body-dark font-semibold text-sm leading-none mb-3">
                District*
              </label>
              <select
                {...register('city', {
                  required: 'forms:city-required',
                })}
                className="px-4 h-12 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-gray-300 focus:border-accent"
              >
                <option value="">{t('forms:select-city')}</option>
                {deliveryCharge?.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
              {errors.city?.message && (
                <p className="my-2 text-xs text-red-500">
                  {t(errors.city.message)}
                </p>
              )}
            </div>

            <Input
              labelKey="forms:label-postcode"
              {...register('zipCode')}
              variant="solid"
              className="w-full lg:w-1/2 ltr:lg:ml-3 rtl:lg:mr-3 mt-2 md:mt-0"
            />
          </div>
          <div className="relative flex items-center ">
            <CheckBox labelKey="forms:label-save-information" />
          </div>
          <TextArea
            labelKey="forms:label-order-notes"
            {...register('note')}
            placeholderKey="forms:placeholder-order-notes"
            className="relative pt-3 xl:pt-6"
          />
          <div className="flex w-full">
            <Button
              className="w-full sm:w-auto"
              loading={isPending}
              disabled={isPending}
            >
              {t('common:button-place-order')}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CheckoutForm;