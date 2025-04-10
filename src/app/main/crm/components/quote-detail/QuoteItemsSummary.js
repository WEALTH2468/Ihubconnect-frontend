export default function QuoteItemsSummary({ quote, items }) {
  return (
    <div
      className="mt-16 flex flex-col w-[70%] bg-[#f7f7f8] p-24 "
      style={{
        borderRadius: '10px',
      }}
    >
      <div className=" space-y-32">
        <div className="flex items-center justify-between text-[#252525]">
          <h3 className="font-bold text-lg">Sub Total</h3>
          <p className="font-bold text-lg text-[#090707]">
            {quote.currency.name}
            {quote.subTotal?.toLocaleString()}
          </p>
        </div>
        <div className=" flex items-center justify-between">
          <h3 className=" text-lg text-[#252525]">VAT</h3>
          <p className="text-lg text-[#252525]">{quote.vat}%</p>
        </div>
        <div className=" flex items-center justify-between">
          <h3 className=" text-lg text-[#252525]">Discount</h3>
          <p className="text-lg text-[#252525]">{quote.discount}%</p>
        </div>
      </div>

      <div className="flex justify-between border-t mt-16 py-16">
        <h2 className="font-bold ">Total (NGN)</h2>
        <h2 className="font-bold text-[#343434]">
          {quote.currency.name}
          {quote.total?.toLocaleString()}
        </h2>
      </div>
    </div>
  );
}
