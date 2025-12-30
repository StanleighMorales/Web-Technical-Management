import { useMutation, useQueryClient } from '@tanstack/react-query';
import { returnItem } from "../../api/item_api";


export const useReturmItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: returnItem,
        mutationKey: ["returnItem"],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["items"] })
            queryClient.invalidateQueries({ queryKey: ["lentItems"] })
        },
        onError: (error) => {
            console.log(error)
        }
    })
}
