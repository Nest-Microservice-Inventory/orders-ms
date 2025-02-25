import { ArrayMinSize, IsArray, IsNumber, IsString, ValidateNested } from "class-validator";
import { OrderDetailDto } from "./order-detail.dto";
import { Type } from "class-transformer";

export class CreateOrderDto {

    @IsString()
    userId: string;

    @IsString()
    clientName: string;
    
    @IsString()
    clientLastname: string;

    @IsNumber()
    total: number;

    @IsArray()
    @ArrayMinSize(1, { message: "Debe agregar minimo un producto"})
    @ValidateNested({ each: true })
    @Type(() => OrderDetailDto)
    orderDetails: OrderDetailDto[]

}
