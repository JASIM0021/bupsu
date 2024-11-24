import globalApiSlice from '../globalApiSlice';

const appointmentSlice = globalApiSlice.injectEndpoints({
  endpoints: builder => ({
    createAppointment: builder.mutation({
      query: data => ({
        url: 'appointments',
        method: 'POST',
        body: data,
      }),
    }),
    createDirectAppointment: builder.mutation({
      query: data => ({
        url: 'appointments/create-direct-appointment',
        method: 'POST',
        body: data,
      }),
    }),

    //appointments/my-appointments

    getMyAppointment: builder.query({
      query: data => ({
        url: 'appointments/my-appointments',
        method: 'GET',
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateAppointmentMutation,
  useGetMyAppointmentQuery,
  useCreateDirectAppointmentMutation,
} = appointmentSlice;
