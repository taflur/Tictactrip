import request from 'supertest';
import app from '../src/app';

describe('POST /api/token', () => {
    it('should return a token when a valid email is provided', async () => {
        const response = await request(app)
            .post('/api/token')
            .send({ email: 'valid@email.com' });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('token');
    });

    it('should return an error when no email is provided', async () => {
        const response = await request(app)
            .post('/api/token')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
});

describe('POST /api/justify', () => {
    it('should return an error when there is no text provided', async () => {

        let token;
        const resToken = await request(app)
            .post('/api/token')
            .send({ email: 'valid@email.com' });
        token = resToken.body.token

        const response = await request(app)
            .post('/api/justify')
            .set('Authorization', token)
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it('should return a justified text when an unjustified text is provided', async () => {

        let token;
        const resToken = await request(app)
            .post('/api/token')
            .send({ email: 'valid@email.com' });
        token = resToken.body.token

        const response = await request(app)
            .post('/api/justify')
            .set('Authorization', token)
            .send({ text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'.repeat(200) });

        expect(response.status).toBe(201);
    });
});