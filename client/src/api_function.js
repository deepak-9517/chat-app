export const url = "https://chatapp-backend-qltw.onrender.com/api";
export const socketUrl = "https://chatapp-backend-qltw.onrender.com";
import axios from "axios";

export const userRegister = async (formdata) => {
  try {
    const res = await axios.post(`${url}/user/register`, formdata);
    return res;
  } catch (error) {
    return { error: true, message: error.response?.data?.message };
  }
};

export const emailVerify = async (formdata) => {
  try {
    const res = await axios.post(`${url}/user/check-email`, formdata);
    return res;
  } catch (error) {
    return { error: true, message: error.response?.data?.message };
  }
};

export const userDetail = async (token) => {
  try {
    const res = await axios.get(`${url}/user/user-detail`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    return { error: true, message: error?.response?.data?.message };
  }
};

export const passwordVerify = async (formdata) => {
  try {
    const res = await axios.post(`${url}/user/check-password`, formdata);
    return res;
  } catch (error) {
    return { error: true, message: error?.response?.data?.message };
  }
};

export const logOut = async (id) => {
  try {
    const res = await axios.get(`${url}/user/logout/${id}`);
    return res;
  } catch (error) {
    return { error: true, message: error?.response?.data?.message };
  }
};

export const updateUserDetail = async (formdata, token) => {
  try {
    const res = await axios.post(`${url}/user/update-detail`, formdata, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    return { error: true, message: error?.response?.data?.message };
  }
};

export const searchUserByNameEmail = async (search, token) => {
  try {
    const res = await axios.post(
      `${url}/user/search`,
      { search: search },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res;
  } catch (error) {
    return { error: true, message: error?.response?.data?.message };
  }
};
