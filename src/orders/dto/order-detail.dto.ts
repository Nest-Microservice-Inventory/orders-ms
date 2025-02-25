import { IsNumber, IsPositive, IsString } from "class-validator";

export class OrderDetailDto {

    @IsString()
    productId: string
    
    @IsString()
    productName: string

    @IsNumber()
    @IsPositive()
    productPriceSale: number;

    @IsNumber()
    @IsPositive()
    subTotal: number;    
    
    @IsNumber()
    @IsPositive()
    quantity: number;

}