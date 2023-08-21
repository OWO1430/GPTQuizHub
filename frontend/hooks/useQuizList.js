import useSWR from "swr";
import axios from "axios";
import nookies from "nookies";
import Swal from "sweetalert2";

const fetcher = async (url) => {
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${nookies.get().access_token}` },
  });
  console.log(response);
  return [response.data.data.quizzes, response.data.data.next_cursor];
};
const useQuizList = () => {
  const { data, error } = useSWR([`${process.env.NEXT_PUBLIC_API_URL}/quizzes/search`], fetcher);
  if (error) {
    console.log(error);
    if (error.response?.status >= 500 && error.response?.status < 600) {
      Swal.fire("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
    } else {
      Swal.fire("無法取得題庫", `${error}`, "error");
    }
  }
  return {
    quizzes: data?.[0] || [],
    nextCursor: data?.[1] || null,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useQuizList;
