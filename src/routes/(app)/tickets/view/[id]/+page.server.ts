import { Collections,type TicketMessagesResponse , type TicketsResponse, type UsersResponse } from '$lib/types/pocketbase-types';
import { eq } from 'typed-pocketbase';
import type { PageServerLoad } from './$types';
import { pbAdmin } from '$lib/server/pb-admin';

export const load = (async ({locals, params}) => {
    const {user} = locals
    const {id: ticketId} = params

    interface messagesWithUsers extends TicketMessagesResponse{
        expand:{
            user: UsersResponse
        }
    }

    interface ticketWithCreator extends TicketsResponse{
        expand:{
            created_by: UsersResponse
        }
    }

    const ticket = await pbAdmin.collection(Collections.Tickets).getOne<ticketWithCreator>(ticketId, {
        expand: 'created_by'
    })

    if(ticket.user !== user.id){
        throw new Error('unauthorized')
    }

    const messages = await pbAdmin.collection(Collections.TicketMessages).getFullList<messagesWithUsers>({
        filter: eq('ticket', ticketId),
        sort: '+created',
        expand: 'user'
    })


    return {
        ticket,
        messages
    };
}) satisfies PageServerLoad;