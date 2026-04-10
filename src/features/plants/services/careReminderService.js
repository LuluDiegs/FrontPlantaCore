import api from '../../../lib/axios';

export const careReminderService = {
    generateForPlant(plantaId) {
        return api.post(`/Planta/${plantaId}/gerar-lembrete-cuidado`).then((r) => r.data);
    },

    generateForAllPlants() {
        return api.post('/lembretes-cuidado/gerar-para-todas-plantas').then((r) => r.data);
    },
};
