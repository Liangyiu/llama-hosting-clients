<script lang="ts">
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    console.log(data.messages);
</script>

<div class="w-full p-4">
    <h1 class="text-3xl font-semibold">subject: {data.ticket.subject}</h1>
    
    <h3 class="text-2xl">id: {data.ticket.id}</h3>

    {#each data.messages as message }
        <textarea class="textarea">
            {message.message}
        </textarea>
    {/each}
</div>
