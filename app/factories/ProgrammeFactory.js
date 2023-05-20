class ProgrammeFactory {
    constructor({ config, errors, akupayDisbursementService }) {
        this.config = config;
        this.errors = errors;
        this.akupayDisbursementService = akupayDisbursementService;
    }
    async all() {
        const data = await this.akupayDisbursementService.allProgramme();

        return data;
    }
    
    async get({ params }) {
        const data = await this.akupayDisbursementService.getProgramme(params.id);

        return data
    }

    async create({ body }) {
        const data = await this.akupayDisbursementService.createProgramme(body);

        return data
    }

    async delete({ params }) {
        await this.akupayDisbursementService.deleteProgramme(params.id);

        return 'Deleted Successfully';
    }

    async createMessage({ params, body }) {
        const data = await this.akupayDisbursementService.createMessage(params.id, body);

        return data
    }

    async getMessage({ params }) {
        const data = await this.akupayDisbursementService.getMessage(params.id);

        return data
    }

    async allMessage({ params }) {
        await this.akupayDisbursementService.allMessage(params);

        return 'Deleted Successfully';
    }

    async updateMessage({ params, body }) {
        const data = await this.akupayDisbursementService.updateMessage(params.id, body);

        return data
    }

    async deleteMessage({ body }) {
        const data = await this.akupayDisbursementService.deleteMessage(body);

        return data
    }

    async getProgrammeMessage({ params, query }) {
        const data = await this.akupayDisbursementService.getProgrammeMessage(params.id, query);

        return data
    }

    async updateProgrammme({ params, body}) {
        const data = await this.akupayDisbursementService.updateProgrammme(params.id, body);

        return data
    }
    
}

module.exports = ProgrammeFactory;
