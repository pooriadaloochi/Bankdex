import React from 'react';
import { Market } from '../../modules';
import { Decimal } from '../Decimal';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { Autoplay, Navigation } from 'swiper';
import 'swiper/swiper-bundle.min.css';
import 'swiper/react/swiper-react';
import { ArrowIcon } from '../../assets/images/customization/ArrowIcon';

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
    const markets2 = markets?.map((el, i) => i > 4 ? el : null)
    const prevTrickerRef = React.useRef<HTMLHeadingElement>(null);
    const nextTrickerRef = React.useRef<HTMLHeadingElement>(null);


    return (
        <div className='pg-ticker-table'>
            <div className='pg-ticker-table__table-wrap'>
                <div className='parentSlider'>
                    <Swiper
                        spaceBetween={50}
                        pagination={{ clickable: true }}
                        loop={true}
                        slidesPerView={1}
                        modules={[Autoplay, Navigation]}
                        navigation={{
                            prevEl: prevTrickerRef.current,
                            nextEl: nextTrickerRef.current,
                        }}
                        onBeforeInit={(swiper) => {
                            // @ts-ignore
                            swiper.params.navigation.prevEl = prevTrickerRef.current;
                            // @ts-ignore
                            swiper.params.navigation.nextEl = nextTrickerRef.current;
                        }}
                    >
                        {markets1[0] &&
                            <SwiperSlide>
                                <div className='itemSlider'>
                                    {markets1.map(renderItem)}
                                </div>
                            </SwiperSlide>
                        }
                        {markets2[0] &&
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
                        }

                        <div className='prevPaginationBonus' ref={prevTrickerRef} >
                            <div className="prevPaginationBonus_button">
                                <ArrowIcon colorSvg={'var(--primary-text-color)'} />
                            </div>
                        </div>
                        <div className='nextPaginationBonus' ref={nextTrickerRef} >
                            <div className="nextPaginationBonus_button">
                                <ArrowIcon colorSvg={'var(--primary-text-color)'} />
                            </div>
                        </div>
                    </Swiper>

                </div>
            </div>
        </div>
    );
};
