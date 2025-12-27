import { create } from "zustand";
import { extractErrorMessage } from "../utils/errorHandler";
import { fetchData } from "../api/axios";
import { API_ENDPOINT } from "../model/constants/api";
import type { Course, Review } from "../model/course";
import { useAuthStore } from "./authStore";


interface CourseState {
    courseData: Course[]
    isLoading: boolean
    error: string
    successMessage: string
    metaData: {
        page: number,
        limit: number,
        hasNext: boolean
    },
    reviewData: Review[],
    fetchCourses: () => Promise<void>
    enrollInCourse: (courseId: string) => Promise<void>
    fetchCourseReviews: (courseId: string) => Promise<void>
    sendReview: (data: { courseId: string, comment: string, rating: number}) => Promise<void>
}

const useCourseStore = create<CourseState>((set) => ({
    courseData: [],
    isLoading: false,
    error: '',
    successMessage: '',
    metaData: {
        page: 1,
        limit: 10,
        hasNext: false
    },
    reviewData: [],

    fetchCourses: async () => {
        try{
            set({isLoading: true})

            const response = await fetchData({
                method: 'get',
                url: API_ENDPOINT.courses,
            })
            set({
                courseData: response?.data,
                metaData: response?.meta
            })
        }catch(error){
            const errorMessage = extractErrorMessage(error)
            set({error: errorMessage})
        }finally{
            set({isLoading: false})
        }
    },
    enrollInCourse: async (courseId: string) => {
        try{
            set({isLoading: true})

            const response = await fetchData({
                method: 'post',
                url: API_ENDPOINT.courseEnrollment.replace("{courseId}", courseId),
            })
            set({
                successMessage: response.message
            })

        }catch(error){
            const errorMessage = extractErrorMessage(error);
            set({
                error: errorMessage
            })
        }finally{
            set({isLoading: false})
        }
    },
    fetchCourseReviews: async (courseId: string) => {
        try{
            set({isLoading: true})
            const response = await fetchData({
                method: 'get',
                url: API_ENDPOINT.courseReview.replace('{courseId}',courseId)
            })

            set({
                successMessage: response.message,
                reviewData: response.data,
                metaData: response.meta
            })
        }catch(error){
            const errorMessage = extractErrorMessage(error);
            set({error: errorMessage})
        }finally{
            set({isLoading: false})
        }
    },
    sendReview: async (data: { courseId: string, comment: string, rating: number}) => {
        try{
            set({isLoading: true})
            const user = useAuthStore.getState().user;
            const payload = {
                ...data,
                userId: user?.id,
            }

            const response = await fetchData({
                method: 'post',
                url: API_ENDPOINT.sendReview.replace('{courseId}', data.courseId),
                payload
            })

            set({
                successMessage: response.message,
            })
        }catch(error){
            const errorMessage = extractErrorMessage(error);
            set({
                error: errorMessage
            })
        }finally{
            set({isLoading: false})
        }
    }
}))

export default useCourseStore;