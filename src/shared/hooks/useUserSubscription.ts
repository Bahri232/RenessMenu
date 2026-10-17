export const checkIfSubscribed = (_status?: string) => {
  return true;
};

export const useUserSubscription = () => {
  return {
    subscriptionData: {
      status: "active",
      endsAt: null,
      renewsAt: null,
      updatePaymentUrl: null,
    },
    isSubscriptionLoading: false,
    isSubscribed: true,
  };
};
