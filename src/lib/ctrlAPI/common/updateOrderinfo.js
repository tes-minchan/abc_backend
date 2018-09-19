const db = require("lib/db");
const dbQuery = require("lib/dbquery/market");
const async = require("async");
const { bithumbAPI, coinoneAPI, gopaxAPI, upbitAPI } = require('lib/API');


module.exports = {

  bithumbUpdate : (orderinfo) => {
    return new Promise((resolve, reject) => {
      bithumbAPI.getOrderInfo(orderinfo, (error, result) => {
        if(error) {
          reject(error);
        }
        else {
          if(result.status === '5600') {
            // Order is already done or cancelled.
            bithumbAPI.getOrderDoneInfo(orderinfo, (error, result) => {
              if(error) {
                reject(error);
              }
              else {
                if(result.status === '5600') {
                  // Order Cancelled.
                  const _updateOrder = {
                    order_id : orderinfo.order_id,
                    market_status : "cancelled"
                  }
                  async.waterfall([db.getConnection, async.apply(dbQuery.updateCancelOrder, _updateOrder)]);
                  resolve();
                }
                else {
                  for(const element of result.data) {
                    const _insertOrder = {
                      uuid       : orderinfo.uuid,
                      order_id   : orderinfo.order_id,
                      market     : orderinfo.market, 
                      trade_date : Number(element.transaction_date)/1000,
                      currency   : element.order_currency,
                      side       : element.type === 'ask' ? 'SELL' : 'BUY',
                      volume     : element.units_traded,
                      price      : element.price,
                      fee        : element.fee,
                      total      : element.total
                    }
                    async.waterfall([db.getConnection, async.apply(dbQuery.insertDoneOrder, _insertOrder) ]);
                  }
                  resolve();
                }
              }

            });
            
          }
          else {
            // Order is processing, on the orderbook.
            const _getOrderInfo = result.data[0];
            const _updateOrder = {
              order_id : _getOrderInfo.order_id,
              market   : orderinfo.market, 
              currency : _getOrderInfo.order_currency,
              side     : _getOrderInfo.type === 'ask' ? "SELL" : "BUY",
              price    : _getOrderInfo.price,
              volume   : _getOrderInfo.units,
              market_status : "placed",
              remain_volume : _getOrderInfo.units_remaining
            }

            async.waterfall([db.getConnection, async.apply(dbQuery.updateOrderinfo, _updateOrder)]);
            resolve();

          }
          
        }
      });

    });
  },


  coinoneUpdate: (orderinfo) => {
    return new Promise((resolve, reject) => {

      coinoneAPI.getOrderInfo(orderinfo, (error, result) => {

        if(error) {
          reject(error);
        }
        else {
          if(result.errorCode) {
            // Order Cancelled.
            const _updateOrder = {
              order_id : orderinfo.order_id,
              market_status : "cancelled"
            }
            async.waterfall([db.getConnection, async.apply(dbQuery.updateCancelOrder, _updateOrder)]);
            resolve();
          }
          else {
            
            if(result.status === 'filled') {
              // Order Completed.
              const _insertOrder = {
                uuid       : orderinfo.uuid,
                order_id   : result.info.orderId,
                market     : orderinfo.market, 
                trade_date : Number(result.info.timestamp),
                currency   : result.info.currency,
                side       : result.info.type === 'ask' ? "SELL" : "BUY",
                volume     : result.info.qty,
                price      : result.info.price,
                fee        : result.info.fee,
                total      : Number(result.info.price) * Number(result.info.qty)
              }
              async.waterfall([db.getConnection, async.apply(dbQuery.insertDoneOrder, _insertOrder)]);
                          
            }
            else {
                // Order Updated.
              const _updateOrder = {
                order_id : result.info.orderId,
                market   : orderinfo.market, 
                currency : result.info.currency,
                side     : result.info.type === 'ask' ? "SELL" : "BUY",
                price    : result.info.price,
                volume   : result.info.qty,
                market_status : result.status,
                remain_volume : result.info.remainQty
              }
              async.waterfall([db.getConnection, async.apply(dbQuery.updateOrderinfo, _updateOrder)]);
            }
            resolve();
          }

        }

      });
    });
  },

  gopaxUpdate : (orderinfo) => {
    return new Promise((resolve, reject) => {
      gopaxAPI.getOrderInfo(orderinfo, (error, result) => {
        if(error) {
          reject(error);
        }
        else {
          if(result.status === 'completed') {

            const _insertOrder = {
              uuid       : orderinfo.uuid,
              order_id   : result.id,
              market     : orderinfo.market, 
              trade_date : Date.parse(result.updatedAt),
              currency   : result.tradingPairName,
              side       : result.side.toUpperCase(),
              volume     : result.amount,
              price      : result.price,
              fee        : (result.amount * 0.0004 * reslut.price),
              total      : Number(result.price) * Number(result.amount)
            }

            async.waterfall([db.getConnection, async.apply(dbQuery.insertDoneOrder, _insertOrder)]);

          }
          else {
            const _updateOrder = {
              order_id   : result.id,
              market     : orderinfo.market, 
              currency   : result.tradingPairName,
              side       : result.side.toUpperCase(),
              price      : result.price,
              volume     : result.amount,
              remain_volume : result.remaining,
              market_status : result.status,
              status        : result.status === 'cancelled' ? 1 : 0
            }
            async.waterfall([db.getConnection, async.apply(dbQuery.updateOrderinfo, _updateOrder)]);

          }

          resolve();
        }
      });
    });

  },


  upbitUpdate : (orderinfo) => {
    return new Promise((resolve, reject) => {
      upbitAPI.getOrderInfo(orderinfo, (error, result) => {
        if(error) {
          console.log(error);
        }
        else {
          if(result.state === 'done') {

            let _insertOrder = {
              uuid       : orderinfo.uuid,
              order_id   : result.uuid,
              market     : orderinfo.market, 
              trade_date : Date.parse(result.created_at),
              currency   : result.market,
              side       : result.side === 'ask' ? "SELL" : "BUY",
              volume     : result.volume,
              price      : result.price,
              fee        : result.paid_fee
            }

            _insertOrder.total = 0;
            result.trades.forEach(element => {
              _insertOrder.total += Number(element.funds);  
            });
            
            async.waterfall([db.getConnection, async.apply(dbQuery.insertDoneOrder, _insertOrder)]);
            resolve();

          }
          else {
            const _updateOrder = {
              order_id : result.uuid,
              market   : orderinfo.market, 
              currency : result.market,
              side     : result.side === 'ask' ? "SELL" : "BUY",
              price    : result.price,
              volume   : result.volume,
              remain_volume : result.remaining_volume,
              market_status : result.state,
              status        : result.state === 'cancel' ? 1 : 0
            }

            async.waterfall([db.getConnection, async.apply(dbQuery.updateOrderinfo, _updateOrder)]);
            resolve();

          }
        }
      })

    });
  }




}