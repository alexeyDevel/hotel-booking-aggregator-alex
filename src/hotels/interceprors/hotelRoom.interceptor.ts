import {CallHandler, ExecutionContext, NestInterceptor} from "@nestjs/common";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import * as path from "path";

export class HotelRoomInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map(data => {
                console.log(data.images)
                const formattedData = {
                    id: data._id,
                    description: data.description,
                    images: data.images ?  data.images.map(image => path.join(__dirname, '..', `uploads/images/${image}`)) : [],
                    isEnabled: data.isEnabled,
                    hotel: {
                        id: data.hotel,
                        title: 1,
                        description: 1
                    }
                };
                return formattedData;
            }),
        );
    }
}
