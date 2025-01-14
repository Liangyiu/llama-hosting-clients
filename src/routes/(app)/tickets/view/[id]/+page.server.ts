import { Collections, TicketMessagesResponse, type TicketsResponse, type UsersResponse } from '$lib/types/pocketbase-types';
import { eq } from 'typed-pocketbase';
import type { PageServerLoad } from './$types';
import { pbAdmin } from '$lib/server/pb-admin';

export const load = (async ({locals, params}) => {
    const {pb} = locals
    const {id: ticketId} = params

    interface messagesWithUsers extends TicketMessagesResponse{
        expand:{
            user: UsersResponse
        }
    }

    const ticket = await pb.collection(Collections.Tickets).getOne<TicketsResponse>(ticketId)
    const messagesResponse = pbAdmin.collection(Collections.TicketMessages).getFullList<messagesWithUsers>({
        filter: eq('ticket', ticketId),
        sort: '-created',
        expand: 'user'
    })


    return {
        ticket,
        messagesResponse
    };
}) satisfies PageServerLoad;