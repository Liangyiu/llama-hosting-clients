import { Collections, type TicketsResponse } from '$lib/types/pocketbase-types';
import { eq } from 'typed-pocketbase';
import type { PageServerLoad } from './$types';

export const load = (async ({locals, params}) => {
    const {pb} = locals
    const {id: ticketId} = params

    const ticket = await pb.collection(Collections.Tickets).getOne<TicketsResponse>(ticketId)
    const messages = await pb.collection(Collections.TicketMessages).getFullList({
        filter: eq('ticket', ticketId),
        sort: '-created'
    })


    return {
        ticket,
        messages
    };
}) satisfies PageServerLoad;