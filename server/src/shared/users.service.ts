// Vendors
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CustomLoginDto } from '../dto/custom-auth.dto';
import { User } from '../models/user.model';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private UserRepository: Repository<User>) { }

    public async findByEmail(email: string): Promise<User> {
        return await this.UserRepository.findOne({
            where: {
                email,
            },
        });
    }

    public async findById(id: string): Promise<User> {
        const res = await this.UserRepository.findOne(id);
        return res;
    }

    public async create(user: User): Promise<User> {
        return this.findByEmail(user.email).then(async res => {
            if (!res) {
                return await this.UserRepository.save(user);
            }
            return;
        });
    }

    public async customCreate(user: CustomLoginDto): Promise<CustomLoginDto> {
        return this.findByEmail(user.email).then(async res => {
            if (!res) {
                return await this.UserRepository.save(user);
            }
            return res;
        });
    }
}
