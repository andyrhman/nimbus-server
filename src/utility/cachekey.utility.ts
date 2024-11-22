import { client } from '../index';

export const invalidateCache = async (pattern: string): Promise<void> => {
    let cursor: any = '0';

    do {
        try {
            const reply = await client.scan(cursor, {
                MATCH: pattern,
                COUNT: 100,
            });

            cursor = reply.cursor;
            const keys = reply.keys;

            if (keys.length > 0) {
                await Promise.all(keys.map((key) => client.del(key)));
            }

            if (cursor === '0' && keys.length === 0) {
                break;
            }
        } catch (err) {
            break;
        }
    } while (cursor !== '0');
};

export const cachePatterns = ['allTempatWisata_*', 'tempatWisataProvinsi_*', 'tempatWisataCategory_*'];
