import { ref } from 'vue';

const toastState = ref({
  show: false,
  message: '',
  type: 'success',
  timeout: null
});

export const useToast = () => {
  const showToast = (message, type = 'success') => {
    if (toastState.value.timeout) {
      clearTimeout(toastState.value.timeout);
    }
    toastState.value.message = message;
    toastState.value.type = type;
    toastState.value.show = true;
    toastState.value.timeout = setTimeout(() => {
      toastState.value.show = false;
    }, 3500);
  };

  const closeToast = () => {
    toastState.value.show = false;
  };

  return {
    toastState,
    showToast,
    closeToast
  };
};
