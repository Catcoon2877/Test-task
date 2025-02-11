import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  updated_at: string;
}

interface ReposState {
  repos: Repo[];
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
}

const initialState: ReposState = {
  repos: [],
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
};

export const fetchRepos = createAsyncThunk(
  'repos/fetchRepos',
  async (username: string, { getState }) => {
    const state = getState() as { repos: ReposState };
    const { page } = state.repos;

    try {
      const response = await axios.get(
        `https://api.github.com/users/${username}/repos`,
        {
          params: {
            page,
            per_page: 20,
          },
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          throw new Error('Превышен лимит запросов. Попробуйте позже или используйте токен.');
        }
        if (error.response?.status === 404) {
          throw new Error('Пользователь с таким именем не найден.');
        }
        throw new Error('Ошибка при загрузке репозиториев');
      }
      throw error;
    }
  }
);

const reposSlice = createSlice({
  name: 'repos',
  initialState,
  reducers: {
    resetRepos(state) {
      state.repos = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRepos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRepos.fulfilled, (state, action: PayloadAction<Repo[]>) => {
        state.loading = false;
        state.repos = [...state.repos, ...action.payload];
        state.page += 1;
        state.hasMore = action.payload.length > 0;
      })
      .addCase(fetchRepos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка при загрузке репозиториев';
      });
  },
});

export const { resetRepos } = reposSlice.actions;
export default reposSlice.reducer;