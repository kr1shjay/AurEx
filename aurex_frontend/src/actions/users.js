// import config
import axios, { setAuthorization, removeAuthorization, handleResp } from "../config/axios";
import config from "../config";
import { removeAuthToken, setAuthToken } from "../lib/localStorage";

// import action
import { setTradeTheme } from "./commonAction";
import { setTradeTheme as setTradeThemeLocal } from "../lib/localStorage";

// import constant
import {
  SET_USER_ACCOUNT,
  SET_BANK_DETAIL,
  SET_BANK_FORM,
  SET_USER_SETTING,
  REMOVE_AUTHENTICATION,
  UPDATE_USER_ACCOUNT,
  RESET_NOTICE,
  UPDATE_2FA_STATUS,
} from "../constant";

// import action
import { decodeJwt } from "./jsonWebToken";
import { getAssetData } from "./walletAction";

export const createUser = async (data) => {
  try {
    let respData = await axios({
      method: "post",
      url: `/api/register`,
      data,
    });
    return {
      status: "success",
      loading: false,
      message: respData.data.message,
      // userToken: respData.data.userToken,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
      message: err.response.data.message,
      error: err.response.data.errors,
    };
  }
};

export const check2fa = async (data) => {
  try {
    let respData = await axios({
      method: "post",
      url: `/api/check2fa`,
      data,
    });
    if (respData?.data?.status == "TWO_FA") {
      return {
        status: "TWO_FA",
        loading: false,
        message: respData?.data?.message,
      };
    }
    return {
      status: "success",
      loading: false,
      message: respData?.data?.message,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
      message: err?.response?.data?.message,
      error: err?.response?.data?.errors,
    };
  }
}

export const verifyOtp = async (data) => {
  try {
    let respData = await axios({
      method: "post",
      url: `${config.API_URL}/api/verifyOtp`,
      data,
    });

    return {
      status: "success",
      messages: respData.data.messages,
      loading: false,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
      error: err.response.data.errors,
    };
  }
};

export const createUserPhone = async (data) => {
  try {
    let respData = await axios({
      method: "post",
      url: `${config.API_URL}/api/registerphone`,
      data,
    });

    return {
      loading: false,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      loading: false,
      error: err.response.data.errors,
    };
  }
};

export const userEmailActivation = async (data) => {
  try {
    let respData = await axios({
      method: "post",
      url: `/api/confirm-mail`,
      data,
    });
    return {
      status: "success",
      loading: false,
      message: respData.data.message,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
      error: err.response.data.errors,
      message: err.response.data.message,
    };
  }
};

export const login = async (data, dispatch) => {
  try {
    let respData = await axios({
      method: "post",
      url: `/api/login`,
      data,
    });
    console.log("respData", respData)
    console.log("data", respData.data)
    if (respData.data.status == "TWO_FA") {
      return {
        status: "TWO_FA",
        loading: false,
        message: respData.data.message,
      };
    }

    setAuthorization(respData.data.token);
    decodeJwt(respData.data.token, dispatch);
    setAuthToken(respData.data.token);
    dispatch(setAccountData(respData.data.result));
    getAssetData(dispatch);
    setTradeThemeLocal(respData.data.userSetting.theme);
    return {
      status: "success",
      loading: false,
      result: respData.data.result,
      message: respData.data.message,
      userSetting: respData.data.userSetting,
    };
    // }
  } catch (err) {
    handleResp(err, 'error')
    try {
      return {
        status: "failed",
        loading: false,
        message: err.response.data.message,
        error: err.response.data.errors,
        authToken: err.response.data.authToken,
      };
    } catch (err) {
      handleResp(err, 'error')
      return {
        status: "failed",
        loading: false,
      };
    }
  }
};

export const editUserProfile = async (data, dispatch) => {
  try {
    let respData = await axios({
      method: "put",
      url: `/api/userProfile`,
      data,
    });
    dispatch(setAccountData(respData.data.result));
    return {
      status: "success",
      loading: false,
      message: respData.data.message,
      result: respData.data.result,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
      message: err.response.data.message,
      error: err.response.data.errors,
    };
  }
};

export const viewUserProfile = async (dispatch) => {
  try {
    let respData = await axios({
      method: "get",
      url: `/api/userProfile`,
    });
    dispatch(setAccountData(respData.data.result));
    return {
      status: "success",
      loading: false,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
    };
  }
};

export const showBtn = async () => {
  try {
    let respData = await axios({
      method: "get",
      url: `/api/hide-btn`,
    });
    return {
      status: "success",
      loading: false,
      result: respData.data.result,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
    };
  }
};

export const setAccountData = (data) => {
  return {
    type: SET_USER_ACCOUNT,
    data: {
      userId: data.userId,
      uniqueId: data.uniqueId,
      firstName: data.firstName,
      lastName: data.lastName,
      profileImage: data.profileImage,
      email: data.email,
      blockNo: data.blockNo,
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      postalCode: data.postalCode,
      emailStatus: data.emailStatus,
      phoneStatus: data.phoneStatus,
      phoneCode: data.phoneCode,
      phoneNo: data.phoneNo,
      type: data.type,
      twoFAStatus: data.twoFAStatus,
      createAt: data.createAt,
      loginHistory: data.loginHistory,
      bankDetail: data.bankDetail,
    },
  };
};

export const updateAcctData = (data) => {
  return {
    type: UPDATE_USER_ACCOUNT,
    data,
  };
};

export const forgotPassword = async (data) => {
  try {
    let respData = await axios({
      method: "post",
      url: `/api/forgotPassword`,
      data,
    });
    return {
      status: "success",
      loading: false,
      message: respData.data.message,
      result: respData.data.result,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
      message: err.response.data.message,
      error: err.response.data.errors,
    };
  }
};

export const resetPassword = async (data) => {
  try {
    let respData = await axios({
      method: "post",
      url: `/api/resetPassword`,
      data,
    });

    return {
      status: "success",
      loading: false,
      message: respData.data.message,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
      message: err.response.data.message,
      error: err.response.data.errors,
    };
  }
};

export const getBankDetail = async (dispatch) => {
  try {
    let respData = await axios({
      method: "get",
      url: `/api/bankdetail`,
    });
    dispatch(
      setBankDetail({
        result: respData.data.result,
      })
    );
    return true;
  } catch (err) {
    handleResp(err, 'error')
    return false;
  }
};

export const updateBankDetail = async (data, dispatch) => {
  try {
    let respData = await axios({
      method: "post",
      url: `/api/bankdetail`,
      data,
    });

    dispatch(
      setBankDetail({
        formType: "",
        formDisable: true,
        result: respData.data.result,
      })
    );
    return {
      status: "success",
      loading: false,
      message: respData.data.message,
      result: respData.data.result,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
      message: err.response.data.message,
      error: err.response.data.errors,
    };
  }
};

export const setPrimaryBank = async (data, dispatch) => {
  try {
    let respData = await axios({
      method: "patch",
      url: `/api/bankdetail`,
      data,
    });

    dispatch(
      setBankDetail({
        result: respData.data.result,
      })
    );
    return {
      status: "success",
      loading: false,
      message: respData.data.message,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
      message: err.response.data.message,
    };
  }
};

export const deleteBankDetail = async (data, dispatch) => {
  try {
    let respData = await axios({
      method: "put",
      url: `/api/bankdetail`,
      data,
    });

    dispatch(
      setBankDetail({
        result: respData.data.result,
        formType: "",
        formDisable: true,
        editRecord: {},
      })
    );
    return {
      status: "success",
      loading: false,
      message: respData.data.message,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
      message: err.response.data.message,
    };
  }
};

export const setBankDetail = (data) => {
  return {
    type: SET_BANK_DETAIL,
    data,
  };
};

export const setBankForm = (data) => {
  return {
    type: SET_BANK_FORM,
    data,
  };
};

export const changePassword = async (data) => {
  try {
    let respData = await axios({
      method: "post",
      url: `/api/changePassword`,
      data,
    });

    return {
      status: "success",
      loading: false,
      message: respData.data.message,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
      message: err.response.data.message,
      error: err.response.data.errors,
    };
  }
};

export const get2faCode = async () => {
  try {
    let respData = await axios({
      method: "get",
      url: `/api/security/2fa`,
    });
    return {
      status: "success",
      loading: false,
      result: respData.data.result,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
      message: err.response.data.message,
    };
  }
};

export const update2faCode = async (data, dispatch) => {
  try {
    let respData = await axios({
      method: "put",
      url: `/api/security/2fa`,
      data,
    });
    dispatch(update2FaStatus(respData.data.result.twoFaStatus));
    return {
      status: "success",
      loading: false,
      message: respData.data.message,
      result: respData.data.result,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
      message: err.response.data.message,
      error: err.response.data.errors,
    };
  }
};

export const disabled2faCode = async (data, dispatch) => {
  try {
    let respData = await axios({
      method: "patch",
      url: `/api/security/2fa`,
      data,
    });
    dispatch(update2FaStatus(respData.data.result.twoFaStatus));
    return {
      status: "success",
      loading: false,
      message: respData.data.message,
      result: respData.data.result,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
      message: err.response.data.message,
      error: err.response.data.errors,
    };
  }
};

export const getUserSetting = async (dispatch) => {
  try {
    let respData = await axios({
      method: "get",
      url: `/api/userSetting`,
    });
    dispatch(setUserSetting(respData.data.result));
    return true;
  } catch (err) {
    handleResp(err, 'error')
    return false;
  }
};

export const setUserSetting = (data) => {
  return {
    type: SET_USER_SETTING,
    data,
  };
};
export const update2FaStatus = (data) => {
  return {
    type: UPDATE_2FA_STATUS,
    data,
  };
};

export const editUserSetting = async (data, dispatch) => {
  try {
    let respData = await axios({
      method: "put",
      url: `/api/userSetting`,
      data,
    });

    // setTradeThemeLocal(respData.data.result.theme)
    dispatch(setUserSetting(respData.data.result));
    return {
      status: "success",
      loading: false,
      message: respData.data.message,
      result: respData.data.result,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
      message: err.response.data.message,
      error: err.response.data.errors,
    };
  }
};

export const upgradeUser = async (data, dispatch) => {
  try {
    let respData = await axios({
      method: "post",
      url: `/api/upgradeUser`,
      data,
    });
    dispatch(setAccountData(respData.data.result));
    return {
      status: "success",
      loading: false,
      message: respData.data.message,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
      message: err.response.data.message,
    };
  }
};

export const changeNewPhone = async (data) => {
  try {
    let respData = await axios({
      method: "post",
      url: `/api/phoneChange`,
      data,
    });

    return {
      status: "success",
      loading: false,
      message: respData.data.message,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
      message: err.response.data.message,
      error: err.response.data.errors,
    };
  }
};

export const verifyNewPhone = async (data) => {
  try {
    let respData = await axios({
      method: "put",
      url: `/api/phoneChange`,
      data,
    });
    return {
      status: "success",
      loading: false,
      message: respData.data.message,
      result: respData.data.result,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
      message: err.response.data.message,
      error: err.response.data.errors,
    };
  }
};

export const editEmail = async (data) => {
  try {
    let respData = await axios({
      method: "post",
      url: `/api/emailChange`,
      data,
    });

    return {
      status: "success",
      loading: false,
      message: respData.data.message,
      result: respData.data.result,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
      message: err.response.data.message,
      error: err.response.data.errors,
    };
  }
};

export const verifyOldEmail = async (data) => {
  try {
    let respData = await axios({
      method: "put",
      url: `/api/emailChange`,
      data,
    });

    return {
      status: "success",
      loading: false,
      message: respData.data.message,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
      message: err.response.data.message,
    };
  }
};

export const verifyNewEmail = async (data) => {
  try {
    let respData = await axios({
      method: "patch",
      url: `/api/emailChange`,
      data,
    });

    return {
      status: "success",
      loading: false,
      message: respData.data.message,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
      message: err.response.data.message,
    };
  }
};

export const referralHist = async () => {
  try {
    let respData = await axios({
      method: "get",
      url: `/api/referralHist`,
    });
    return {
      status: "success",
      loading: false,
      result: respData.data.result,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
    };
  }
};

export const getTranList = async () => {
  try {
    let respData = await axios({
      method: "get",
      url: `/api/transList`,
    });
    return {
      status: "success",
      loading: false,
      result: respData.data.result,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
    };
  }
};

export const sentOTP = async (data) => {
  try {
    let respData = await axios({
      method: "post",
      url: `/api/sentOTP`,
      data,
    });
    return {
      status: "success",
      loading: false,
      message: respData.data.message,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
      message: err.response.data.message,
      error: err.response.data.errors,
    };
  }
};

/* ********************** */
export const verifyIpAddress = async (data, dispatch) => {
  try {
    let respData = await axios({
      method: "post",
      url: `${config.API_URL}/api/verifyIpAddress`,
      data,
    });
    await setAuthToken(respData.data.token);
    // decodeJwt(respData.data.token, dispatch)
    // await dispatch(setCurrentUser(respData.data.result))
    // await setInitialCall();
    return {
      status: "success",
      loading: false,
      result: respData.data.result,
      messages: respData.data.messages,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
      error: err.response.data.errors,
    };
  }
};

export const getCurrentUser = async (token, dispatch) => {
  try {
    let respData = await axios({
      method: "get",
      url: `${config.API_URL}/api/currentUser`,
      headers: {
        Authorization: token,
      },
    });
    // dispatch(setCurrentUser(respData.data.result))
    return true;
  } catch (err) {
    handleResp(err, 'error')
    return false;
  }
};

export const forgotPasswordMobile = async (data) => {
  try {
    let respData = await axios({
      method: "post",
      url: `${config.API_URL}/api/forgotPassword/mobile`,
      data,
    });
    return {
      status: "success",
      loading: false,
      messages: respData.data.messages,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
      error: err.response.data.errors,
    };
  }
};

export const logout = (history, dispatch) => {
  removeAuthToken();
  removeAuthorization();
  history.push("/login");
  dispatch({
    type: REMOVE_AUTHENTICATION,
    authData: {
      isAuth: false,
    },
  });
  dispatch({
    type: RESET_NOTICE,
  });
};

export const editProfile = async (data) => {
  try {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("profileImage", data.profileImage);

    let respData = await axios({
      method: "put",
      url: `${config.API_URL}/api/account/profile`,
      headers: {
        "content-type": "multipart/form-data",
        Authorization: localStorage.user_token,
      },
      data: formData,
    });

    return {
      status: "success",
      loading: false,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
      error: err.response.data.errors,
    };
  }
};

export const getGeoInfoData = async (data) => {
  try {
    let respData = await axios({
      method: "get",
      url: `${config.getGeoInfo}`,
    });

    return {
      status: "success",
      loading: false,
      result: respData.data,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
      error: err.response.data.errors,
    };
  }
};

export const getUserDetail = async () => {
  try {
    let respData = await axios({
      method: "get",
      url: `${config.API_URL}/api/account/userProfile`,
      headers: {
        Authorization: localStorage.user_token,
      },
    });

    return {
      status: "success",
      loading: false,
      result: respData.data.result,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
      error: err.response.data.errors,
    };
  }
};

export const AddFavorite = async (data) => {
  try {
    let respData = await axios({
      method: "post",
      url: `${config.API_URL}/api/add-fav`,
      data,
    });
    return {
      status: "success",
      loading: false,
      messages: respData.data.messages,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
      error: err.response.data.errors,
    };
  }
};

export const GetFavorite = async () => {
  try {
    let respData = await axios({
      method: "get",
      url: `${config.API_URL}/api/get-fav`,
    });
    return {
      status: "success",
      loading: false,
      messages: respData.data.messages,
      result: respData.data.result,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
      error: err.response.data.errors,
    };
  }
};

export const getAllTrade = async () => {
  try {
    let respData = await axios({
      method: "get",
      url: `/api/Statistic`,
    });
    return {
      status: "success",
      loading: false,
      result: respData.data.result,
    };
  } catch (err) {
    handleResp(err, 'error')
    return {
      status: "failed",
      loading: false,
      message: err.response.data.message,
    };
  }
};
