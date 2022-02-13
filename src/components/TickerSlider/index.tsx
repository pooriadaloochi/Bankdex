import React from 'react';
import { Market } from '../../modules';
import { Decimal } from '../Decimal';
// import { ArrowIcon } from '../../assets/images/customization/ArrowIcon';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Props {
    currentBidUnit: string;
    currentBidUnitsList: string[];
    markets: Market[];
    redirectToTrading: (key: string) => void;
    setCurrentBidUnit: (key: string) => void;
}

export const TickerSlider: React.FC<Props> = ({
    markets,
    redirectToTrading,
}) => {

    const renderItem = React.useCallback(
        (market, index: number) => {
            const marketChangeColor = +(market.change || 0) < 0 ? 'negative' : 'positive';

            return (
                <div key={index} className='itemSliderOne' onClick={() => redirectToTrading(market.id)}>

                    <div className='itemSliderName'>
                        <span>{market && market.name}</span>
                        <span className={marketChangeColor}>{market.price_change_percent}</span>

                        <div className='itemSliderPecision'>
                            <span>
                                <Decimal fixed={market.amount_precision} thousSep=','>
                                    {market.last}
                                </Decimal>
                            </span>
                        </div>
                    </div>
                    <div>
                        <span className='itemSliderVolume'>
                            <Decimal fixed={market.amount_precision} thousSep=','>
                                {market.volume}
                            </Decimal>
                            {' '}$
                        </span>
                    </div>

                </div>
            );
        },
        [redirectToTrading]
    );
    const markets1 = markets?.map((el, i) => i < 5 ? el : null)
    // const markets2 = markets?.map((el, i) => i > 4 ? el : null)
    // const prevTrickerRef = React.useRef<HTMLHeadingElement>(null);
    // const nextTrickerRef = React.useRef<HTMLHeadingElement>(null);
    // console.log(markets1);
    // const renderPrevArrow = (
    //     <div className='prevPaginationBonus' ref={prevTrickerRef} >
    //         <div className="prevPaginationBonus_button">
    //             <ArrowIcon colorSvg={'var(--primary-text-color)'} />
    //         </div>
    //     </div>
    // )
    // const renderNexArrow = (
    //     <div className='nextPaginationBonus' ref={nextTrickerRef} >
    //         <div className="nextPaginationBonus_button">
    //             <ArrowIcon colorSvg={'var(--primary-text-color)'} />
    //         </div>
    //     </div>
    // )
    const renderSlides = () =>
        [1, 2, 3, 4, 5, 6, 7, 8].map(num => (
            num === 0 ? <div className='itemSlider'>
                {markets1.map(renderItem)}
            </div> : <div className='itemSlider'>
                {markets1.map(renderItem)}
            </div>
        ));
    return (
        <div className='pg-ticker-table'>
            <div className='pg-ticker-table__table-wrap'>
                <div className='parentSlider'>
                    <Slider
                        dots={true}
                        slidesToShow={4}
                        slidesToScroll={1}
                        // autoplay={true}
                        autoplaySpeed={1000}
                        vertical={true}
                        infinite={true}
                        adaptiveHeight={true}
                        draggable={false}
                        pauseOnHover={true}
                    // nextArrow={renderNexArrow}
                    // prevArrow={renderPrevArrow}
                    >
                        {renderSlides()}
                    </Slider>
                    {/* {markets2[0] &&
                        <SwiperSlide>
                            <div className='itemSlider'>
                                pooriadaloods
                            </div>
                        </SwiperSlide>
                    }
                    {markets1[0] &&
                        <SwiperSlide>
                            <div className='itemSlider'>
                                {markets1.map(renderItem)}
                            </div>
                        </SwiperSlide>
                    } */}



                </div>
            </div>
        </div>
    );
};