import { api } from "@/lib/api";

export type Course = {
  id: string;
  slug: string;
  thumbnail_key: string | null;
  // full URL for thumbnail image (can be null)
  thumbnail_url?: string | null;
  title: string;
  type: string;
  is_published: boolean;
  updated_at: string;
  description: string | null;
  price: number | null;
  language: string;
  created_at: string;
};

export type GetCoursesAdminRes = Course[];

export async function getCoursesAdminApi(): Promise<GetCoursesAdminRes> {
  const res = await api.get<GetCoursesAdminRes>("/api/v1/courses/admin");
  return res.data;
}

export type DeleteCourseRes = Record<string, unknown> | null;

export async function deleteCourseApi(slug: string): Promise<DeleteCourseRes> {
  const res = await api.delete<DeleteCourseRes>(`/api/v1/courses/${slug}`);
  return res.data;
}

export type CreateCourseBody = {
  title: string;
  slug: string;
  description?: string | null;
  language?: string | null;
  price?: number | null;
  type?: string | null;
};

export type CreateCourseRes = Course;

export async function createCourseApi(body: CreateCourseBody): Promise<CreateCourseRes> {
  const res = await api.post<CreateCourseRes>("/api/v1/courses", body);
  return res.data;
}

export type UpdateCourseBody = {
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  language?: string | null;
  price?: number | null;
  type?: string | null;
  is_published?: boolean | null;
};
export type UpdateCourseRes = Course;
export async function updateCourseApi(slug: string, body: UpdateCourseBody): Promise<UpdateCourseRes> {
  const res = await api.put<UpdateCourseRes>(`/api/v1/courses/${slug}`, body);
  return res.data;
}


// ——— Course thumbnail upload ———
export type GetThumbnailSignedUrlBody = {
  file_type: "image/jpeg" | "image/png" | "image/webp";
};

export type GetThumbnailSignedUrlRes = {
  object_key: string;
  upload_url?: string;
  signed_url?: string;
  url?: string;
  [key: string]: unknown;
};

export async function getCourseThumbnailSignedUrlApi(
  body: GetThumbnailSignedUrlBody
): Promise<GetThumbnailSignedUrlRes> {
  const res = await api.post<GetThumbnailSignedUrlRes>("/api/v1/courses/get-signed-url", body);
  return res.data;
}

export type SaveThumbnailBody = {
  object_key: string;
};

export type SaveThumbnailRes = {
  success: boolean;
  detail: string;
};

export async function saveCourseThumbnailApi(
  slug: string,
  body: SaveThumbnailBody
): Promise<SaveThumbnailRes> {
  const res = await api.post<SaveThumbnailRes>(
    `/api/v1/courses/save-thumbnail/${slug}`,
    body
  );
  return res.data;
}

export async function deleteCourseThumbnailApi(slug: string): Promise<null> {
  const res = await api.delete<null>(`/api/v1/courses/delete-thumbnail/${slug}`);
  return res.data;
}

// ——— Course content (admin) ———
export type Lesson = {
  id: string;
  module_id: string;
  content_id: string | null;
  /** Quiz ID when content_type is "quiz" (API may return this instead of or in addition to content_id) */
  quiz_id?: string | null;
  content_type: string;
  content_uploaded: boolean;
  title: string;
  description: string | null;
  order_index: number;
  is_published: boolean;
  is_free_preview: boolean;
  created_at: string;
  updated_at: string;
};

export type Module = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  lessons?: Lesson[];
};

export type GetCourseContentAdminRes = {
  course: Course;
  modules: Module[];
};

export async function getCourseContentAdminApi(slug: string): Promise<GetCourseContentAdminRes> {
  const res = await api.get<GetCourseContentAdminRes>(`/api/v1/courses/admin/content/${slug}`);
  return res.data;
}

// ——— Add module ———
export type AddModuleBody = {
  title: string;
  description?: string | null;
  order_index: number;
  content_type: "module";
};

export type AddModuleRes = {
  success: boolean;
  detail: string;
  module: Module;
};

export async function addModuleApi(slug: string, body: AddModuleBody): Promise<AddModuleRes> {
  body = {
    ...body,
    content_type: "module",
  };
  const res = await api.post<AddModuleRes>(`/api/v1/module/${slug}`, body);
  return res.data;
}

// ——— Update module ———
export type UpdateModuleBody = {
  title?: string | null;
  description?: string | null;
  is_published?: boolean | null;
};

export type UpdateModuleRes = Module;

export async function updateModuleApi(
  moduleId: string,
  body: UpdateModuleBody
): Promise<UpdateModuleRes> {
  const res = await api.put<UpdateModuleRes>(`/api/v1/module/${moduleId}`, body);
  return res.data;
}

// ——— Delete module ———
export async function deleteModuleApi(moduleId: string): Promise<null> {
  const res = await api.delete<null>(`/api/v1/module/${moduleId}`);
  return res.data;
}

// ——— Add lesson ———
export type AddLessonBody = {
  title: string;
  description?: string | null;
  content_type: "video" | "quiz" | "live";
  order_index: number;
};

export type AddLessonRes = {
  success: boolean;
  detail: string;
  lesson: Lesson;
};

export async function addLessonApi(moduleId: string, body: AddLessonBody): Promise<AddLessonRes> {
  const res = await api.post<AddLessonRes>(`/api/v1/lesson/${moduleId}`, body);
  return res.data;
}

// ——— Update lesson ———
export type UpdateLessonBody = {
  title?: string | null;
  description?: string | null;
  is_published?: boolean | null;
  is_free_preview?: boolean | null;
};

export type UpdateLessonRes = Lesson;

export async function updateLessonApi(
  lessonId: string,
  body: UpdateLessonBody
): Promise<UpdateLessonRes> {
  const res = await api.put<UpdateLessonRes>(`/api/v1/lesson/${lessonId}`, body);
  return res.data;
}

// ——— Delete lesson ———
export async function deleteLessonApi(lessonId: string): Promise<null> {
  const res = await api.delete<null>(`/api/v1/lesson/${lessonId}`);
  return res.data;
}

// ——— Get lesson (admin) — includes content_url for embed
export type LessonAdmin = Lesson & { content_url?: string | null };

export type GetLessonAdminRes = {
  success: boolean;
  lesson: LessonAdmin;
};

export async function getLessonAdminApi(lessonId: string): Promise<GetLessonAdminRes> {
  const res = await api.get<GetLessonAdminRes>(`/api/v1/lesson/admin/${lessonId}`);
  return res.data;
}

// ——— Lesson video upload (TUS credentials from backend) ———
export type LessonUploadVideoRes = {
  success: boolean;
  detail: string;
  upload: {
    video_id: string;
    library_id: string;
    expiration_time: number;
    signature: string;
    tus_endpoint: string;
  };
};

export async function getLessonUploadVideoApi(lessonId: string): Promise<LessonUploadVideoRes> {
  const res = await api.post<LessonUploadVideoRes>(
    `/api/v1/lesson/upload-video/${lessonId}`
  );
  return res.data;
}

// ——— Delete lesson video ———
export async function deleteLessonVideoApi(lessonId: string): Promise<null> {
  const res = await api.delete<null>(`/api/v1/lesson/delete-video/${lessonId}`);
  return res.data;
}

// ——— Create quiz for lesson ———
export type CreateQuizForLessonBody = {
  title: string;
  description?: string | null;
  instructions?: string | null;
  max_attempts?: number;
  passing_percentage?: number;
  quiz_type?: string;
  time_limit_minutes?: number | null;
};

export type Quiz = {
  id: string;
  title: string;
  description: string | null;
  instructions: string | null;
  quiz_type: string;
  time_limit_minutes: number | null;
  passing_percentage: number;
  max_attempts: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export async function createQuizForLessonApi(
  lessonId: string,
  body: CreateQuizForLessonBody
): Promise<Quiz> {
  const res = await api.post<Quiz>(
    `/api/v1/quiz/create-for-lesson/${lessonId}`,
    body
  );
  return res.data;
}

// ——— Get quiz (admin) ———
export async function getQuizAdminApi(quizId: string): Promise<Quiz> {
  const res = await api.get<Quiz>(`/api/v1/quiz/admin/${quizId}`);
  return res.data;
}

// ——— Update quiz ———
export type UpdateQuizBody = {
  title?: string | null;
  description?: string | null;
  instructions?: string | null;
  quiz_type?: string | null;
  time_limit_minutes?: number | null;
  passing_percentage?: number | null;
  max_attempts?: number | null;
};

export async function updateQuizApi(
  quizId: string,
  body: UpdateQuizBody
): Promise<Quiz> {
  const res = await api.put<Quiz>(`/api/v1/quiz/${quizId}`, body);
  return res.data;
}

// ——— Delete quiz ———
export async function deleteQuizApi(quizId: string): Promise<null> {
  const res = await api.delete<null>(`/api/v1/quiz/${quizId}`);
  return res.data;
}

// ——— Get quiz questions (list existing questions) ———
export type GetQuizQuestionsRes = {
  questions: QuizQuestion[];
  total: number;
};

export async function getQuizQuestionsApi(quizId: string): Promise<GetQuizQuestionsRes> {
  const res = await api.get<GetQuizQuestionsRes>(`/api/v1/quiz/${quizId}/questions `);
  return res.data;
}

// ——— Add quiz question ———
export type AddQuizQuestionBody = {
  quiz_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation?: string | null;
  marks?: number;
  negative_marks?: number;
  difficulty_level?: string;
  order_index?: number;
};

export type QuizQuestion = {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string | null;
  marks: number;
  negative_marks: number;
  difficulty_level: string;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export async function addQuizQuestionApi(body: AddQuizQuestionBody): Promise<QuizQuestion> {
  const res = await api.post<QuizQuestion>("/api/v1/quiz/question/add", body);
  return res.data;
}

// ——— Update quiz question ———
export type UpdateQuizQuestionBody = {
  question_text?: string | null;
  option_a?: string | null;
  option_b?: string | null;
  option_c?: string | null;
  option_d?: string | null;
  correct_answer?: string | null;
  explanation?: string | null;
  marks?: number | null;
  negative_marks?: number | null;
  difficulty_level?: string | null;
  order_index?: number | null;
};

export async function updateQuizQuestionApi(
  questionId: string,
  body: UpdateQuizQuestionBody
): Promise<QuizQuestion> {
  const res = await api.put<QuizQuestion>(`/api/v1/quiz/question/${questionId}`, body);
  return res.data;
}

// ——— Delete quiz question ———
export async function deleteQuizQuestionApi(questionId: string): Promise<null> {
  const res = await api.delete<null>(`/api/v1/quiz/question/${questionId}`);
  return res.data;
}
