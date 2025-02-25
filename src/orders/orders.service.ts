import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NATS_SERVICE } from 'src/config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {

  constructor(
    private readonly prisma: PrismaService,
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }


  async create(createOrderDto: CreateOrderDto) {

    const { orderDetails, ...orderData } = createOrderDto;

    try {

      // TODO: VERIFICAR EXISTENCIA DE USUARIO

      // VERIFICAR QUE EL PRODUCTO EXISTA
      const productIds = orderDetails.map(item => item.productId);
      await firstValueFrom( this.client.send('validateProductsIds', productIds) )

      // VERIFICAR EL STOCK DEL PRODUCTO
      const productsQuantity = orderDetails.map(item => {
        return { id: item.productId, quantity: item.quantity }
      })

      const updateProductsStock = await firstValueFrom(
        this.client.send('updateProductStock', productsQuantity)
      )

      if( !updateProductsStock ){
        throw new RpcException({
          message: "Stock insuficiente",
          statusCode: 400,
        })
      }

      // CREACION DE LA ORDEN
      const order = await this.prisma.order.create({
        data: {
          ...orderData,
          orderDetails: {
            create: orderDetails
          }
        },
        include: {
          orderDetails: {
            select: {
              productId: true,
              productName: true,
              quantity: true,
              subTotal: true,
            }
          }
        }
      })

      return {
        order,
        message: "Orden creada exitosamente"
      }
      
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode
      })
    }

  }

  async findAll() {
    const orders = await this.prisma.order.findMany({
      include: {
        orderDetails: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return {
      orders,
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }
}
