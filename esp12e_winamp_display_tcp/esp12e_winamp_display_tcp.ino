#include <ESP8266WiFi.h>
#include <Arduino.h>
#include <U8g2lib.h>

#ifdef U8X8_HAVE_HW_SPI
#include <SPI.h>
#endif
#ifdef U8X8_HAVE_HW_I2C
#include <Wire.h>
#endif

U8G2_SH1106_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, /* reset=*/U8X8_PIN_NONE);

#define ledTX D4
#define ledRX D0

#define OFFSET_BITRATE_KBPS 12                                         // +12
#define OFFSET_LENGTH_SECONDS_TOTAL 16                                 // +4
#define OFFSET_LENGTH_SECONDS 20                                       // +4
#define OFFSET_LENGTH_MINUTES_1 24                                     // +4
#define OFFSET_LENGTH_MINUTES_2 28                                     // +4
#define OFFSET_LENGTH_HOURS_1 32                                       // +4
#define OFFSET_LENGTH_HOURS_2 36                                       // +4
#define OFFSET_LENGTH_DAYS 40                                          // +4
#define OFFSET_LENGTH_MINUTES_SECONDS_STRING 44                        // +4
#define OFFSET_LENGTH_MINUTES_SECONDS_STRING_LENGTH 60                 // +16
#define OFFSET_LENGTH_HOURS_MINUTES_SECONDS_STRING 64                  // +4
#define OFFSET_LENGTH_HOURS_MINUTES_SECONDS_STRING_LENGTH 80           // +16
#define OFFSET_LENGTH_DAYS_HOURS_MINUTES_SECONDS_STRING 84             // +4
#define OFFSET_LENGTH_DAYS_HOURS_MINUTES_SECONDS_STRING_LENGTH 100     // +16
#define OFFSET_VOLUME_LEVEL 104                                        // +4
#define OFFSET_VISUALIZER_STATE 105                                    // +1
#define OFFSET_POSITION_SECONDS_TOTAL 106                              // +1
#define OFFSET_POSITION_SECONDS 110                                    // +4
#define OFFSET_POSITION_MINUTES_1 114                                  // +4
#define OFFSET_POSITION_MINUTES_2 118                                  // +4
#define OFFSET_POSITION_HOURS_1 122                                    // +4
#define OFFSET_POSITION_HOURS_2 126                                    // +4
#define OFFSET_POSITION_DAYS 130                                       // +4
#define OFFSET_POSITION_MINUTES_SECONDS_STRING 134                     // +4
#define OFFSET_POSITION_MINUTES_SECONDS_STRING_LENGTH 150              // +16
#define OFFSET_POSITION_HOURS_MINUTES_SECONDS_STRING 154               // +4
#define OFFSET_POSITION_HOURS_MINUTES_SECONDS_STRING_LENGTH 170        // +16
#define OFFSET_POSITION_DAYS_HOURS_MINUTES_SECONDS_STRING 174          // +4
#define OFFSET_POSITION_DAYS_HOURS_MINUTES_SECONDS_STRING_LENGTH 190   // +16
#define OFFSET_REMAINING_SECONDS_TOTAL 194                             // +4
#define OFFSET_REMAINING_SECONDS 198                                   // +4
#define OFFSET_REMAINING_MINUTES_1 202                                 // +4
#define OFFSET_REMAINING_MINUTES_2 206                                 // +4
#define OFFSET_REMAINING_HOURS_1 210                                   // +4
#define OFFSET_REMAINING_HOURS_2 214                                   // +4
#define OFFSET_REMAINING_DAYS 218                                      // +4
#define OFFSET_REMAINING_MINUTES_SECONDS_STRING 222                    // +4
#define OFFSET_REMAINING_MINUTES_SECONDS_STRING_LENGTH 238             // +16
#define OFFSET_REMAINING_HOURS_MINUTES_SECONDS_STRING 242              // +4
#define OFFSET_REMAINING_HOURS_MINUTES_SECONDS_STRING_LENGTH 258       // +16
#define OFFSET_REMAINING_DAYS_HOURS_MINUTES_SECONDS_STRING 262         // +4
#define OFFSET_REMAINING_DAYS_HOURS_MINUTES_SECONDS_STRING_LENGTH 278  // +16
#define OFFSET_AUDIO_CHANNELS 282                                      // +4
#define OFFSET_REPEAT_STATE 283                                        // +1
#define OFFSET_EQ_AUTO_STATE 284                                       // +1
#define OFFSET_SHUFFLE_STATE 285                                       // +1
#define OFFSET_EQ_STATE 286                                            // +1
#define OFFSET_BALANCE_PAN 287                                         // +1
#define OFFSET_TIME_DISPLAY_STATE 288                                  // +1
#define OFFSET_SAMPLE_RATE_KHZ 289                                     // +1
#define OFFSET_SAMPLE_RATE_HZ 293                                      // +4
#define OFFSET_EQ_70HZ 297                                             // +4
#define OFFSET_EQ_180HZ 298                                            // +1
#define OFFSET_EQ_320HZ 299                                            // +1
#define OFFSET_EQ_600HZ 300                                            // +1
#define OFFSET_EQ_1KHZ 301                                             // +1
#define OFFSET_EQ_3KHZ 302                                             // +1
#define OFFSET_EQ_6KHZ 303                                             // +1
#define OFFSET_EQ_12KHZ 304                                            // +1
#define OFFSET_EQ_14KHZ 305                                            // +1
#define OFFSET_EQ_16KHZ 306                                            // +1
#define OFFSET_SONG_TITLE_ASCII_STRING 307                             // +1
#define OFFSET_SONG_TITLE_ASCII_STRING_LENGTH 563                      // +16
#define OFFSET_567 567                                                 // +4
#define OFFSET_SPECTRUM_ANALYZER_START 568                             // Analyzer Bar // +1
#define OFFSET_569 569                                                 // Peak Bar (it alternates like that) // +1
#define OFFSET_570 570                                                 // +1
#define OFFSET_571 571                                                 // +1
#define OFFSET_572 572                                                 // +1
#define OFFSET_573 573                                                 // +1
#define OFFSET_574 574                                                 // +1
#define OFFSET_575 575                                                 // +1
#define OFFSET_576 576                                                 // +1
#define OFFSET_577 577                                                 // +1
#define OFFSET_578 578                                                 // +1
#define OFFSET_579 579                                                 // +1
#define OFFSET_580 580                                                 // +1
#define OFFSET_581 581                                                 // +1
#define OFFSET_582 582                                                 // +1
#define OFFSET_583 583                                                 // +1
#define OFFSET_584 584                                                 // +1
#define OFFSET_585 585                                                 // +1
#define OFFSET_586 586                                                 // +1
#define OFFSET_587 587                                                 // +1
#define OFFSET_588 588                                                 // +1
#define OFFSET_589 589                                                 // +1
#define OFFSET_590 590                                                 // +1
#define OFFSET_591 591                                                 // +1
#define OFFSET_592 592                                                 // +1
#define OFFSET_593 593                                                 // +1
#define OFFSET_594 594                                                 // +1
#define OFFSET_595 595                                                 // +1
#define OFFSET_596 596                                                 // +1
#define OFFSET_597 597                                                 // +1
#define OFFSET_598 598                                                 // +1
#define OFFSET_599 599                                                 // +1
#define OFFSET_600 600                                                 // +1
#define OFFSET_601 601                                                 // +1
#define OFFSET_602 602                                                 // +1
#define OFFSET_603 603                                                 // +1
#define OFFSET_604 604                                                 // +1
#define OFFSET_SPECTRUM_ANALYZER_END 605                               // +1

const char* wifiSsid = "DLinkle";
const char* wifiPass = "1155810860";

// Target TCP Server details
const char* tcpServerIp = "192.168.15.7";  // Replace with your target IP
const uint16_t tcpServerPort = 1337;       // Replace with your target port

uint32_t tcpMessageByteCounter = 0UL;

uint32_t timeoutCurrent = millis();
uint32_t timeoutDuration = 5000;

uint8_t winampDisplayDataBuffer[610] = { 0x00, 0x00, 0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0b, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00, 0x00, 0x00, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0b, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0b, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x57, 0x69, 0x6e, 0x61, 0x6d, 0x70, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };
uint8_t winampDisplayDataDefaultBuffer[610] = { 0x00, 0x00, 0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0b, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00, 0x00, 0x00, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0b, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x3a, 0x30, 0x30, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0b, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x57, 0x69, 0x6e, 0x61, 0x6d, 0x70, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };

int32_t bitrateKbps = 0L;
int32_t lengthSecondsTotal = 0L;
int32_t lengthSeconds = 0L;
int32_t lengthMinutes1 = 0L;
int32_t lengthMinutes2 = 0L;
int32_t lengthHours1 = 0L;
int32_t lengthHours2 = 0L;
int32_t lengthDays = 0L;

char lengthMinutesSecondsString[17] = "00:00";
uint32_t lengthMinutesSecondsStringLength = 5UL;
char lengthHoursMinutesSecondsString[17] = "00:00:00";
uint32_t lengthHoursMinutesSecondsStringLength = 8UL;
char lengthDaysHoursMinutesSecondsString[17] = "00:00:00:00";
uint32_t lengthDaysHoursMinutesSecondsStringLength = 11UL;

uint8_t volumeLevel = 255;
uint8_t visualizerState = 0;
int32_t positionSecondsTotal = 0L;
int32_t positionSeconds = 0L;
int32_t positionMinutes1 = 0L;
int32_t positionMinutes2 = 0L;
int32_t positionHours1 = 0L;
int32_t positionHours2 = 0L;
int32_t positionDays = 0L;

char positionMinutesSecondsString[17] = "00:00";
uint32_t positionMinutesSecondsStringLength = 5UL;
char positionHoursMinutesSecondsString[17] = "00:00:00";
uint32_t positionHoursMinutesSecondsStringLength = 8UL;
char positionDaysHoursMinutesSecondsString[17] = "00:00:00:00";
uint32_t positionDaysHoursMinutesSecondsStringLength = 11UL;

int32_t remainingSecondsTotal = 0L;
int32_t remainingSeconds = 0L;
int32_t remainingMinutes1 = 0L;
int32_t remainingMinutes2 = 0L;
int32_t remainingHours1 = 0L;
int32_t remainingHours2 = 0L;
int32_t remainingDays = 0L;

char remainingMinutesSecondsString[17] = "-00:00";
uint32_t remainingMinutesSecondsStringLength = 6UL;
char remainingHoursMinutesSecondsString[17] = "-00:00:00";
uint32_t remainingHoursMinutesSecondsStringLength = 9UL;
char remainingDaysHoursMinutesSecondsString[17] = "-00:00:00:00";
uint32_t remainingDaysHoursMinutesSecondsStringLength = 12UL;

uint8_t audioChannels = 0;
uint8_t repeatState = 1;
uint8_t eqAutoState = 0;
uint8_t shuffleState = 0;
uint8_t eqState = 0;
int8_t balancePan = 0;
uint8_t timeDisplayState = 0;  // 0 = Elapsed, 1 = Remaining
int8_t timeDisplayMode = 0;    // 0 = MM:SS, 1 = HH:MM:SS, 2 = DD:HH:MM:SS
int32_t sampleRateKhz = 0;
int32_t sampleRateHz = 0;

uint8_t eq70Hz = 128;
uint8_t eq180Hz = 128;
uint8_t eq320Hz = 128;
uint8_t eq600Hz = 128;
uint8_t eq1Khz = 128;
uint8_t eq3Khz = 128;
uint8_t eq6Khz = 128;
uint8_t eq12Khz = 128;
uint8_t eq14Khz = 128;
uint8_t eq16Khz = 128;

char songTitleAsciiString[257] = "Winamp";
uint32_t songTitleAsciiStringLength = 6UL;
uint32_t songTitleAsciiStringLengthPrevious = 6UL;

uint8_t spectrumAnalyzerRaw[38] = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };  // The spectrum analyzer and spectrum analyzer peaks are alternated
uint8_t spectrumAnalyzer[19] = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
uint8_t spectrumAnalyzerPeak[19] = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };

int32_t songTitleXPos = 47;

WiFiClient client;

void setup() {
  Serial.begin(500000);
  Serial.print(millis());
  Serial.println(" Starting...");
  client.setTimeout(timeoutDuration);
  pinMode(ledTX, OUTPUT);
  pinMode(ledRX, OUTPUT);  // STATE OF LEDS IS INVERTED
  digitalWrite(ledTX, HIGH);
  digitalWrite(ledRX, HIGH);
  resetVariables();
  u8g2.setBusClock(20000000);
  u8g2.begin();
  u8g2.setBusClock(20000000);
  u8g2.clearBuffer();
  u8g2.drawBox(0, 0, 128, 64);
  u8g2.sendBuffer();
  /*
  for (uint32_t winampDisplayDataBufferIndex = 0UL; winampDisplayDataBufferIndex < sizeof(winampDisplayDataBuffer); winampDisplayDataBufferIndex++) {
    // Make sure buffer is properly initialized
    winampDisplayDataBuffer[winampDisplayDataBufferIndex] = winampDisplayDataDefaultBuffer[winampDisplayDataBufferIndex];
  }
  */
  Serial.print(millis());
  Serial.print(" Connecting to ");
  Serial.println(wifiSsid);
  WiFi.begin(wifiSsid, wifiPass);

  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
    Serial.print(".");
  }
  Serial.print(millis());
  Serial.print(" Connected to ");
  Serial.println(wifiSsid);
}

void loop() {
  tcpMessageByteCounter = 0UL;
  //resetVariables();
  if (!client.connect(tcpServerIp, tcpServerPort)) {
    resetVariables();
    //parseWinampData();
    drawWinampOled();
    return;
  }
  if (client.connected() == 0) {
    // Draw default Winamp data here or display error message or something
    resetVariables();
    parseWinampData();
    drawWinampOled();
    return;
  }
  if (client.connected() != 0) {
    digitalWrite(ledTX, LOW);
    uint8_t rawPayload[] = {
      0x01,
      0x00,
      0x01,
      0x23,
      0x45,
      0x67,
      0x89,
      0xAB,
      0xCD,
      0xEF,
      0x00,
      0x01,
      0x01
    };
    client.write(rawPayload, sizeof(rawPayload));
    digitalWrite(ledTX, HIGH);

    timeoutCurrent = millis();
    while (client.available() == 0) {
      if (millis() - timeoutCurrent > timeoutDuration) {
        client.stop();
        resetVariables();
        //parseWinampData();
        drawWinampOled();
        return;
      }
    }

    while (client.available()) {
      digitalWrite(ledRX, LOW);
      uint8_t tcpMessageByte = client.read();
      winampDisplayDataBuffer[tcpMessageByteCounter] = tcpMessageByte;
      tcpMessageByteCounter++;
      digitalWrite(ledRX, HIGH);
    }

    if (tcpMessageByteCounter != sizeof(winampDisplayDataBuffer)) {
      drawWinampOled();
      return;
    }
    if (tcpMessageByteCounter == sizeof(winampDisplayDataBuffer)) {
      if (winampDisplayDataBuffer[0] != 0x00) {
        drawWinampOled();
        return;
      }
      if (winampDisplayDataBuffer[0] == 0x00) {
        if (winampDisplayDataBuffer[2] != 0x01 || winampDisplayDataBuffer[3] != 0x23 || winampDisplayDataBuffer[4] != 0x45 || winampDisplayDataBuffer[5] != 0x67 || winampDisplayDataBuffer[6] != 0x89 || winampDisplayDataBuffer[7] != 0xAB || winampDisplayDataBuffer[8] != 0xCD || winampDisplayDataBuffer[9] != 0xEF) {
          drawWinampOled();
          return;
        }
        if (winampDisplayDataBuffer[2] == 0x01 && winampDisplayDataBuffer[3] == 0x23 && winampDisplayDataBuffer[4] == 0x45 && winampDisplayDataBuffer[5] == 0x67 && winampDisplayDataBuffer[6] == 0x89 && winampDisplayDataBuffer[7] == 0xAB && winampDisplayDataBuffer[8] == 0xCD && winampDisplayDataBuffer[9] == 0xEF) {
          if (winampDisplayDataBuffer[11] != 0x00) {
            drawWinampOled();
            return;
          }
          if (winampDisplayDataBuffer[11] == 0x00) {
            parseWinampData();
          }
        }
      }
    }

    drawWinampOled();
    client.stop();
  }
}

void resetVariables() {
  for (uint32_t winampDisplayDataBufferIndex = 0UL; winampDisplayDataBufferIndex < sizeof(winampDisplayDataBuffer); winampDisplayDataBufferIndex++) {
    // Make sure buffer is properly reset
    winampDisplayDataBuffer[winampDisplayDataBufferIndex] = winampDisplayDataDefaultBuffer[winampDisplayDataBufferIndex];
  }
  // Reset all variables every loop iteration
  bitrateKbps = 0L;
  lengthSecondsTotal = 0L;
  lengthSeconds = 0L;
  lengthMinutes1 = 0L;
  lengthMinutes2 = 0L;
  lengthHours1 = 0L;
  lengthHours2 = 0L;
  lengthDays = 0L;

  for (uint32_t lengthMinutesSecondsStringIndex = 0UL; lengthMinutesSecondsStringIndex < sizeof(lengthMinutesSecondsString); lengthMinutesSecondsStringIndex++) {
    lengthMinutesSecondsString[lengthMinutesSecondsStringIndex] = 0;
  }
  for (uint32_t lengthHoursMinutesSecondsStringIndex = 0UL; lengthHoursMinutesSecondsStringIndex < sizeof(lengthHoursMinutesSecondsString); lengthHoursMinutesSecondsStringIndex++) {
    lengthHoursMinutesSecondsString[lengthHoursMinutesSecondsStringIndex] = 0;
  }
  for (uint32_t lengthDaysHoursMinutesSecondsStringIndex = 0UL; lengthDaysHoursMinutesSecondsStringIndex < sizeof(lengthDaysHoursMinutesSecondsString); lengthDaysHoursMinutesSecondsStringIndex++) {
    lengthDaysHoursMinutesSecondsString[lengthDaysHoursMinutesSecondsStringIndex] = 0;
  }

  lengthMinutesSecondsString[0] = '0';
  lengthMinutesSecondsString[1] = '0';
  lengthMinutesSecondsString[2] = ':';
  lengthMinutesSecondsString[3] = '0';
  lengthMinutesSecondsString[4] = '0';
  lengthMinutesSecondsString[5] = '\0';
  lengthMinutesSecondsStringLength = 5UL;
  lengthHoursMinutesSecondsString[0] = '0';
  lengthHoursMinutesSecondsString[1] = '0';
  lengthHoursMinutesSecondsString[2] = ':';
  lengthHoursMinutesSecondsString[3] = '0';
  lengthHoursMinutesSecondsString[4] = '0';
  lengthHoursMinutesSecondsString[5] = ':';
  lengthHoursMinutesSecondsString[6] = '0';
  lengthHoursMinutesSecondsString[7] = '0';
  lengthHoursMinutesSecondsString[8] = '\0';
  lengthHoursMinutesSecondsStringLength = 8UL;
  lengthDaysHoursMinutesSecondsString[0] = '0';
  lengthDaysHoursMinutesSecondsString[1] = '0';
  lengthDaysHoursMinutesSecondsString[2] = ':';
  lengthDaysHoursMinutesSecondsString[3] = '0';
  lengthDaysHoursMinutesSecondsString[4] = '0';
  lengthDaysHoursMinutesSecondsString[5] = ':';
  lengthDaysHoursMinutesSecondsString[6] = '0';
  lengthDaysHoursMinutesSecondsString[7] = '0';
  lengthDaysHoursMinutesSecondsString[8] = ':';
  lengthDaysHoursMinutesSecondsString[9] = '0';
  lengthDaysHoursMinutesSecondsString[10] = '0';
  lengthDaysHoursMinutesSecondsString[11] = '\0';
  lengthDaysHoursMinutesSecondsStringLength = 11UL;

  volumeLevel = 255;
  visualizerState = 0;
  positionSecondsTotal = 0L;
  positionSeconds = 0L;
  positionMinutes1 = 0L;
  positionMinutes2 = 0L;
  positionHours1 = 0L;
  positionHours2 = 0L;
  positionDays = 0L;

  for (uint32_t positionMinutesSecondsStringIndex = 0UL; positionMinutesSecondsStringIndex < sizeof(positionMinutesSecondsString); positionMinutesSecondsStringIndex++) {
    positionMinutesSecondsString[positionMinutesSecondsStringIndex] = 0;
  }
  for (uint32_t positionHoursMinutesSecondsStringIndex = 0UL; positionHoursMinutesSecondsStringIndex < sizeof(positionHoursMinutesSecondsString); positionHoursMinutesSecondsStringIndex++) {
    positionHoursMinutesSecondsString[positionHoursMinutesSecondsStringIndex] = 0;
  }
  for (uint32_t positionDaysHoursMinutesSecondsStringIndex = 0UL; positionDaysHoursMinutesSecondsStringIndex < sizeof(positionDaysHoursMinutesSecondsString); positionDaysHoursMinutesSecondsStringIndex++) {
    positionDaysHoursMinutesSecondsString[positionDaysHoursMinutesSecondsStringIndex] = 0;
  }

  positionMinutesSecondsString[0] = '0';
  positionMinutesSecondsString[1] = '0';
  positionMinutesSecondsString[2] = ':';
  positionMinutesSecondsString[3] = '0';
  positionMinutesSecondsString[4] = '0';
  positionMinutesSecondsString[5] = '\0';
  positionMinutesSecondsStringLength = 5UL;
  positionHoursMinutesSecondsString[0] = '0';
  positionHoursMinutesSecondsString[1] = '0';
  positionHoursMinutesSecondsString[2] = ':';
  positionHoursMinutesSecondsString[3] = '0';
  positionHoursMinutesSecondsString[4] = '0';
  positionHoursMinutesSecondsString[5] = ':';
  positionHoursMinutesSecondsString[6] = '0';
  positionHoursMinutesSecondsString[7] = '0';
  positionHoursMinutesSecondsString[8] = '\0';
  positionHoursMinutesSecondsStringLength = 8UL;
  positionDaysHoursMinutesSecondsString[0] = '0';
  positionDaysHoursMinutesSecondsString[1] = '0';
  positionDaysHoursMinutesSecondsString[2] = ':';
  positionDaysHoursMinutesSecondsString[3] = '0';
  positionDaysHoursMinutesSecondsString[4] = '0';
  positionDaysHoursMinutesSecondsString[5] = ':';
  positionDaysHoursMinutesSecondsString[6] = '0';
  positionDaysHoursMinutesSecondsString[7] = '0';
  positionDaysHoursMinutesSecondsString[8] = ':';
  positionDaysHoursMinutesSecondsString[9] = '0';
  positionDaysHoursMinutesSecondsString[10] = '0';
  positionDaysHoursMinutesSecondsString[11] = '\0';
  positionDaysHoursMinutesSecondsStringLength = 11UL;

  remainingSecondsTotal = 0L;
  remainingSeconds = 0L;
  remainingMinutes1 = 0L;
  remainingMinutes2 = 0L;
  remainingHours1 = 0L;
  remainingHours2 = 0L;
  remainingDays = 0L;

  for (uint32_t remainingMinutesSecondsStringIndex = 0UL; remainingMinutesSecondsStringIndex < sizeof(remainingMinutesSecondsString); remainingMinutesSecondsStringIndex++) {
    remainingMinutesSecondsString[remainingMinutesSecondsStringIndex] = 0;
  }
  for (uint32_t remainingHoursMinutesSecondsStringIndex = 0UL; remainingHoursMinutesSecondsStringIndex < sizeof(remainingHoursMinutesSecondsString); remainingHoursMinutesSecondsStringIndex++) {
    remainingHoursMinutesSecondsString[remainingHoursMinutesSecondsStringIndex] = 0;
  }
  for (uint32_t remainingDaysHoursMinutesSecondsStringIndex = 0UL; remainingDaysHoursMinutesSecondsStringIndex < sizeof(remainingDaysHoursMinutesSecondsString); remainingDaysHoursMinutesSecondsStringIndex++) {
    remainingDaysHoursMinutesSecondsString[remainingDaysHoursMinutesSecondsStringIndex] = 0;
  }

  remainingMinutesSecondsString[0] = '-';
  remainingMinutesSecondsString[1] = '0';
  remainingMinutesSecondsString[2] = '0';
  remainingMinutesSecondsString[3] = ':';
  remainingMinutesSecondsString[4] = '0';
  remainingMinutesSecondsString[5] = '0';
  remainingMinutesSecondsString[6] = '\0';
  remainingMinutesSecondsStringLength = 6UL;
  remainingHoursMinutesSecondsString[0] = '-';
  remainingHoursMinutesSecondsString[1] = '0';
  remainingHoursMinutesSecondsString[2] = '0';
  remainingHoursMinutesSecondsString[3] = ':';
  remainingHoursMinutesSecondsString[4] = '0';
  remainingHoursMinutesSecondsString[5] = '0';
  remainingHoursMinutesSecondsString[6] = ':';
  remainingHoursMinutesSecondsString[7] = '0';
  remainingHoursMinutesSecondsString[8] = '0';
  remainingHoursMinutesSecondsString[9] = '\0';
  remainingHoursMinutesSecondsStringLength = 9UL;
  remainingDaysHoursMinutesSecondsString[0] = '-';
  remainingDaysHoursMinutesSecondsString[1] = '0';
  remainingDaysHoursMinutesSecondsString[2] = '0';
  remainingDaysHoursMinutesSecondsString[3] = ':';
  remainingDaysHoursMinutesSecondsString[4] = '0';
  remainingDaysHoursMinutesSecondsString[5] = '0';
  remainingDaysHoursMinutesSecondsString[6] = ':';
  remainingDaysHoursMinutesSecondsString[7] = '0';
  remainingDaysHoursMinutesSecondsString[8] = '0';
  remainingDaysHoursMinutesSecondsString[9] = ':';
  remainingDaysHoursMinutesSecondsString[10] = '0';
  remainingDaysHoursMinutesSecondsString[11] = '0';
  remainingDaysHoursMinutesSecondsString[12] = '\0';
  remainingDaysHoursMinutesSecondsStringLength = 12UL;

  audioChannels = 0;
  repeatState = 1;
  eqAutoState = 0;
  shuffleState = 0;
  eqState = 0;
  balancePan = 0;
  timeDisplayState = 0;
  sampleRateKhz = 0;
  sampleRateHz = 0;

  eq70Hz = 128;
  eq180Hz = 128;
  eq320Hz = 128;
  eq600Hz = 128;
  eq1Khz = 128;
  eq3Khz = 128;
  eq6Khz = 128;
  eq12Khz = 128;
  eq14Khz = 128;
  eq16Khz = 128;

  for (uint32_t songTitleAsciiStringIndex = 0UL; songTitleAsciiStringIndex < sizeof(songTitleAsciiString); songTitleAsciiStringIndex++) {
    songTitleAsciiString[songTitleAsciiStringIndex] = 0;
  }

  songTitleAsciiString[0] = 'W';
  songTitleAsciiString[1] = 'i';
  songTitleAsciiString[2] = 'n';
  songTitleAsciiString[3] = 'a';
  songTitleAsciiString[4] = 'm';
  songTitleAsciiString[5] = 'p';
  songTitleAsciiString[6] = '\0';
  songTitleAsciiStringLength = 6UL;

  for (uint32_t spectrumAnalyzerRawIndex = 0UL; spectrumAnalyzerRawIndex < sizeof(spectrumAnalyzerRaw); spectrumAnalyzerRawIndex++) {
    spectrumAnalyzerRaw[spectrumAnalyzerRawIndex] = 0;
  }
  for (uint32_t spectrumAnalyzerIndex = 0UL; spectrumAnalyzerIndex < sizeof(spectrumAnalyzer); spectrumAnalyzerIndex++) {
    spectrumAnalyzer[spectrumAnalyzerIndex] = 0;
  }
  for (uint32_t spectrumAnalyzerPeakIndex = 0UL; spectrumAnalyzerPeakIndex < sizeof(spectrumAnalyzerPeak); spectrumAnalyzerPeakIndex++) {
    spectrumAnalyzerPeak[spectrumAnalyzerPeakIndex] = 0;
  }
}

void parseWinampData() {
  uint32_t currentOffset = 0UL;
  currentOffset = OFFSET_BITRATE_KBPS;
  bitrateKbps = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;
  currentOffset = OFFSET_LENGTH_SECONDS_TOTAL;
  lengthSecondsTotal = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;
  currentOffset = OFFSET_LENGTH_SECONDS;
  lengthSeconds = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;
  currentOffset = OFFSET_LENGTH_MINUTES_1;
  lengthMinutes1 = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;
  currentOffset = OFFSET_LENGTH_MINUTES_2;
  lengthMinutes2 = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;
  currentOffset = OFFSET_LENGTH_HOURS_1;
  lengthHours1 = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;
  currentOffset = OFFSET_LENGTH_HOURS_2;
  lengthHours2 = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;
  currentOffset = OFFSET_LENGTH_DAYS;
  lengthDays = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;

  currentOffset = OFFSET_LENGTH_MINUTES_SECONDS_STRING_LENGTH;
  lengthMinutesSecondsStringLength = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;
  currentOffset = OFFSET_LENGTH_MINUTES_SECONDS_STRING;
  if (lengthMinutesSecondsStringLength > 0) {
    for (uint32_t lengthMinutesSecondsStringIndex = 0UL; lengthMinutesSecondsStringIndex < lengthMinutesSecondsStringLength; lengthMinutesSecondsStringIndex++) {
      lengthMinutesSecondsString[lengthMinutesSecondsStringIndex] = winampDisplayDataBuffer[currentOffset + lengthMinutesSecondsStringIndex];
    }
    lengthMinutesSecondsString[lengthMinutesSecondsStringLength] = '\0';  // Put a terminator at the end of the string
  }
  if (lengthMinutesSecondsStringLength <= 0) {
    lengthMinutesSecondsString[0] = '0';
    lengthMinutesSecondsString[1] = '0';
    lengthMinutesSecondsString[2] = ':';
    lengthMinutesSecondsString[3] = '0';
    lengthMinutesSecondsString[4] = '0';
    lengthMinutesSecondsString[5] = '\0';
    lengthMinutesSecondsStringLength = 5UL;
  }

  currentOffset = OFFSET_LENGTH_HOURS_MINUTES_SECONDS_STRING_LENGTH;
  lengthHoursMinutesSecondsStringLength = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;
  currentOffset = OFFSET_LENGTH_HOURS_MINUTES_SECONDS_STRING;
  if (lengthHoursMinutesSecondsStringLength > 0) {
    for (uint32_t lengthHoursMinutesSecondsStringIndex = 0UL; lengthHoursMinutesSecondsStringIndex < lengthHoursMinutesSecondsStringLength; lengthHoursMinutesSecondsStringIndex++) {
      lengthHoursMinutesSecondsString[lengthHoursMinutesSecondsStringIndex] = winampDisplayDataBuffer[currentOffset + lengthHoursMinutesSecondsStringIndex];
    }
    lengthHoursMinutesSecondsString[lengthHoursMinutesSecondsStringLength] = '\0';  // Put a terminator at the end of the string
  }
  if (lengthHoursMinutesSecondsStringLength <= 0) {
    lengthHoursMinutesSecondsString[0] = '0';
    lengthHoursMinutesSecondsString[1] = '0';
    lengthHoursMinutesSecondsString[2] = ':';
    lengthHoursMinutesSecondsString[3] = '0';
    lengthHoursMinutesSecondsString[4] = '0';
    lengthHoursMinutesSecondsString[5] = ':';
    lengthHoursMinutesSecondsString[6] = '0';
    lengthHoursMinutesSecondsString[7] = '0';
    lengthHoursMinutesSecondsString[8] = '\0';
    lengthHoursMinutesSecondsStringLength = 8UL;
  }

  currentOffset = OFFSET_LENGTH_DAYS_HOURS_MINUTES_SECONDS_STRING_LENGTH;
  lengthDaysHoursMinutesSecondsStringLength = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;
  currentOffset = OFFSET_LENGTH_DAYS_HOURS_MINUTES_SECONDS_STRING;
  if (lengthDaysHoursMinutesSecondsStringLength > 0) {
    for (uint32_t lengthDaysHoursMinutesSecondsStringIndex = 0UL; lengthDaysHoursMinutesSecondsStringIndex < lengthDaysHoursMinutesSecondsStringLength; lengthDaysHoursMinutesSecondsStringIndex++) {
      lengthDaysHoursMinutesSecondsString[lengthDaysHoursMinutesSecondsStringIndex] = winampDisplayDataBuffer[currentOffset + lengthDaysHoursMinutesSecondsStringIndex];
    }
    lengthDaysHoursMinutesSecondsString[lengthDaysHoursMinutesSecondsStringLength] = '\0';  // Put a terminator at the end of the string
  }
  if (lengthDaysHoursMinutesSecondsStringLength <= 0) {
    lengthDaysHoursMinutesSecondsString[0] = '0';
    lengthDaysHoursMinutesSecondsString[1] = '0';
    lengthDaysHoursMinutesSecondsString[2] = ':';
    lengthDaysHoursMinutesSecondsString[3] = '0';
    lengthDaysHoursMinutesSecondsString[4] = '0';
    lengthDaysHoursMinutesSecondsString[5] = ':';
    lengthDaysHoursMinutesSecondsString[6] = '0';
    lengthDaysHoursMinutesSecondsString[7] = '0';
    lengthDaysHoursMinutesSecondsString[8] = ':';
    lengthDaysHoursMinutesSecondsString[9] = '0';
    lengthDaysHoursMinutesSecondsString[10] = '0';
    lengthDaysHoursMinutesSecondsString[11] = '\0';
    lengthDaysHoursMinutesSecondsStringLength = 11UL;
  }

  currentOffset = OFFSET_VOLUME_LEVEL;
  volumeLevel = winampDisplayDataBuffer[currentOffset];
  currentOffset = OFFSET_VISUALIZER_STATE;
  visualizerState = winampDisplayDataBuffer[currentOffset];
  currentOffset = OFFSET_POSITION_SECONDS_TOTAL;
  positionSecondsTotal = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;
  currentOffset = OFFSET_POSITION_SECONDS;
  positionSeconds = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;
  currentOffset = OFFSET_POSITION_MINUTES_1;
  positionMinutes1 = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;
  currentOffset = OFFSET_POSITION_MINUTES_2;
  positionMinutes2 = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;
  currentOffset = OFFSET_POSITION_HOURS_1;
  positionHours1 = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;
  currentOffset = OFFSET_POSITION_HOURS_2;
  positionHours2 = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;
  currentOffset = OFFSET_POSITION_DAYS;
  positionDays = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;

  currentOffset = OFFSET_POSITION_MINUTES_SECONDS_STRING_LENGTH;
  positionMinutesSecondsStringLength = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;
  currentOffset = OFFSET_POSITION_MINUTES_SECONDS_STRING;
  if (positionMinutesSecondsStringLength > 0) {
    for (uint32_t positionMinutesSecondsStringIndex = 0UL; positionMinutesSecondsStringIndex < positionMinutesSecondsStringLength; positionMinutesSecondsStringIndex++) {
      positionMinutesSecondsString[positionMinutesSecondsStringIndex] = winampDisplayDataBuffer[currentOffset + positionMinutesSecondsStringIndex];
    }
    positionMinutesSecondsString[positionMinutesSecondsStringLength] = '\0';  // Put a terminator at the end of the string
  }
  if (positionMinutesSecondsStringLength <= 0) {
    positionMinutesSecondsString[0] = '0';
    positionMinutesSecondsString[1] = '0';
    positionMinutesSecondsString[2] = ':';
    positionMinutesSecondsString[3] = '0';
    positionMinutesSecondsString[4] = '0';
    positionMinutesSecondsString[5] = '\0';
    positionMinutesSecondsStringLength = 5UL;
  }

  currentOffset = OFFSET_POSITION_HOURS_MINUTES_SECONDS_STRING_LENGTH;
  positionHoursMinutesSecondsStringLength = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;
  currentOffset = OFFSET_POSITION_HOURS_MINUTES_SECONDS_STRING;
  if (positionHoursMinutesSecondsStringLength > 0) {
    for (uint32_t positionHoursMinutesSecondsStringIndex = 0UL; positionHoursMinutesSecondsStringIndex < positionHoursMinutesSecondsStringLength; positionHoursMinutesSecondsStringIndex++) {
      positionHoursMinutesSecondsString[positionHoursMinutesSecondsStringIndex] = winampDisplayDataBuffer[currentOffset + positionHoursMinutesSecondsStringIndex];
    }
    positionHoursMinutesSecondsString[positionHoursMinutesSecondsStringLength] = '\0';  // Put a terminator at the end of the string
  }
  if (positionHoursMinutesSecondsStringLength <= 0) {
    positionHoursMinutesSecondsString[0] = '0';
    positionHoursMinutesSecondsString[1] = '0';
    positionHoursMinutesSecondsString[2] = ':';
    positionHoursMinutesSecondsString[3] = '0';
    positionHoursMinutesSecondsString[4] = '0';
    positionHoursMinutesSecondsString[5] = ':';
    positionHoursMinutesSecondsString[6] = '0';
    positionHoursMinutesSecondsString[7] = '0';
    positionHoursMinutesSecondsString[8] = '\0';
    positionHoursMinutesSecondsStringLength = 8UL;
  }

  currentOffset = OFFSET_POSITION_DAYS_HOURS_MINUTES_SECONDS_STRING_LENGTH;
  positionDaysHoursMinutesSecondsStringLength = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;
  currentOffset = OFFSET_POSITION_DAYS_HOURS_MINUTES_SECONDS_STRING;
  if (positionDaysHoursMinutesSecondsStringLength > 0) {
    for (uint32_t positionDaysHoursMinutesSecondsStringIndex = 0UL; positionDaysHoursMinutesSecondsStringIndex < positionDaysHoursMinutesSecondsStringLength; positionDaysHoursMinutesSecondsStringIndex++) {
      positionDaysHoursMinutesSecondsString[positionDaysHoursMinutesSecondsStringIndex] = winampDisplayDataBuffer[currentOffset + positionDaysHoursMinutesSecondsStringIndex];
    }
    positionDaysHoursMinutesSecondsString[positionDaysHoursMinutesSecondsStringLength] = '\0';  // Put a terminator at the end of the string
  }
  if (positionDaysHoursMinutesSecondsStringLength <= 0) {
    positionDaysHoursMinutesSecondsString[0] = '0';
    positionDaysHoursMinutesSecondsString[1] = '0';
    positionDaysHoursMinutesSecondsString[2] = ':';
    positionDaysHoursMinutesSecondsString[3] = '0';
    positionDaysHoursMinutesSecondsString[4] = '0';
    positionDaysHoursMinutesSecondsString[5] = ':';
    positionDaysHoursMinutesSecondsString[6] = '0';
    positionDaysHoursMinutesSecondsString[7] = '0';
    positionDaysHoursMinutesSecondsString[8] = ':';
    positionDaysHoursMinutesSecondsString[9] = '0';
    positionDaysHoursMinutesSecondsString[10] = '0';
    positionDaysHoursMinutesSecondsString[11] = '\0';
    positionDaysHoursMinutesSecondsStringLength = 11UL;
  }

  currentOffset = OFFSET_REMAINING_SECONDS_TOTAL;
  remainingSecondsTotal = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;
  currentOffset = OFFSET_REMAINING_SECONDS;
  remainingSeconds = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;
  currentOffset = OFFSET_REMAINING_MINUTES_1;
  remainingMinutes1 = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;
  currentOffset = OFFSET_REMAINING_MINUTES_2;
  remainingMinutes2 = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;
  currentOffset = OFFSET_REMAINING_HOURS_1;
  remainingHours1 = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;
  currentOffset = OFFSET_REMAINING_HOURS_2;
  remainingHours2 = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;
  currentOffset = OFFSET_REMAINING_DAYS;
  remainingDays = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;

  currentOffset = OFFSET_REMAINING_MINUTES_SECONDS_STRING_LENGTH;
  remainingMinutesSecondsStringLength = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;
  currentOffset = OFFSET_REMAINING_MINUTES_SECONDS_STRING;
  if (remainingMinutesSecondsStringLength > 0) {
    for (uint32_t remainingMinutesSecondsStringIndex = 0UL; remainingMinutesSecondsStringIndex < remainingMinutesSecondsStringLength; remainingMinutesSecondsStringIndex++) {
      remainingMinutesSecondsString[remainingMinutesSecondsStringIndex] = winampDisplayDataBuffer[currentOffset + remainingMinutesSecondsStringIndex];
    }
    remainingMinutesSecondsString[remainingMinutesSecondsStringLength] = '\0';  // Put a terminator at the end of the string
  }
  if (remainingMinutesSecondsStringLength <= 0) {
    remainingMinutesSecondsString[0] = '-';
    remainingMinutesSecondsString[1] = '0';
    remainingMinutesSecondsString[2] = '0';
    remainingMinutesSecondsString[3] = ':';
    remainingMinutesSecondsString[4] = '0';
    remainingMinutesSecondsString[5] = '0';
    remainingMinutesSecondsString[6] = '\0';
    remainingMinutesSecondsStringLength = 6UL;
  }

  currentOffset = OFFSET_REMAINING_HOURS_MINUTES_SECONDS_STRING_LENGTH;
  remainingHoursMinutesSecondsStringLength = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;
  currentOffset = OFFSET_REMAINING_HOURS_MINUTES_SECONDS_STRING;
  if (remainingHoursMinutesSecondsStringLength > 0) {
    for (uint32_t remainingHoursMinutesSecondsStringIndex = 0UL; remainingHoursMinutesSecondsStringIndex < remainingHoursMinutesSecondsStringLength; remainingHoursMinutesSecondsStringIndex++) {
      remainingHoursMinutesSecondsString[remainingHoursMinutesSecondsStringIndex] = winampDisplayDataBuffer[currentOffset + remainingHoursMinutesSecondsStringIndex];
    }
    remainingHoursMinutesSecondsString[remainingHoursMinutesSecondsStringLength] = '\0';  // Put a terminator at the end of the string
  }
  if (remainingHoursMinutesSecondsStringLength <= 0) {
    remainingHoursMinutesSecondsString[0] = '-';
    remainingHoursMinutesSecondsString[1] = '0';
    remainingHoursMinutesSecondsString[2] = '0';
    remainingHoursMinutesSecondsString[3] = ':';
    remainingHoursMinutesSecondsString[4] = '0';
    remainingHoursMinutesSecondsString[5] = '0';
    remainingHoursMinutesSecondsString[6] = ':';
    remainingHoursMinutesSecondsString[7] = '0';
    remainingHoursMinutesSecondsString[8] = '0';
    remainingHoursMinutesSecondsString[9] = '\0';
    remainingHoursMinutesSecondsStringLength = 9UL;
  }

  currentOffset = OFFSET_REMAINING_DAYS_HOURS_MINUTES_SECONDS_STRING_LENGTH;
  remainingDaysHoursMinutesSecondsStringLength = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;
  currentOffset = OFFSET_REMAINING_DAYS_HOURS_MINUTES_SECONDS_STRING;
  if (remainingDaysHoursMinutesSecondsStringLength > 0) {
    for (uint32_t remainingDaysHoursMinutesSecondsStringIndex = 0UL; remainingDaysHoursMinutesSecondsStringIndex < remainingDaysHoursMinutesSecondsStringLength; remainingDaysHoursMinutesSecondsStringIndex++) {
      remainingDaysHoursMinutesSecondsString[remainingDaysHoursMinutesSecondsStringIndex] = winampDisplayDataBuffer[currentOffset + remainingDaysHoursMinutesSecondsStringIndex];
    }
    remainingDaysHoursMinutesSecondsString[remainingDaysHoursMinutesSecondsStringLength] = '\0';  // Put a terminator at the end of the string
  }
  if (remainingDaysHoursMinutesSecondsStringLength <= 0) {
    remainingDaysHoursMinutesSecondsString[0] = '-';
    remainingDaysHoursMinutesSecondsString[1] = '0';
    remainingDaysHoursMinutesSecondsString[2] = '0';
    remainingDaysHoursMinutesSecondsString[3] = ':';
    remainingDaysHoursMinutesSecondsString[4] = '0';
    remainingDaysHoursMinutesSecondsString[5] = '0';
    remainingDaysHoursMinutesSecondsString[6] = ':';
    remainingDaysHoursMinutesSecondsString[7] = '0';
    remainingDaysHoursMinutesSecondsString[8] = '0';
    remainingDaysHoursMinutesSecondsString[9] = ':';
    remainingDaysHoursMinutesSecondsString[10] = '0';
    remainingDaysHoursMinutesSecondsString[11] = '0';
    remainingDaysHoursMinutesSecondsString[12] = '\0';
    remainingDaysHoursMinutesSecondsStringLength = 12UL;
  }

  if (lengthSecondsTotal <= 0) {
    lengthSecondsTotal = 0;
  }

  if (positionSecondsTotal <= 0) {
    positionSecondsTotal = 0;
  }

  if (lengthSecondsTotal <= 0) {
    remainingSecondsTotal = 0;
  }

  currentOffset = OFFSET_AUDIO_CHANNELS;
  audioChannels = winampDisplayDataBuffer[currentOffset];
  currentOffset = OFFSET_REPEAT_STATE;
  repeatState = winampDisplayDataBuffer[currentOffset];
  currentOffset = OFFSET_EQ_AUTO_STATE;
  eqAutoState = winampDisplayDataBuffer[currentOffset];
  currentOffset = OFFSET_SHUFFLE_STATE;
  shuffleState = winampDisplayDataBuffer[currentOffset];
  currentOffset = OFFSET_EQ_STATE;
  eqState = winampDisplayDataBuffer[currentOffset];
  currentOffset = OFFSET_BALANCE_PAN;
  balancePan = winampDisplayDataBuffer[currentOffset];
  currentOffset = OFFSET_TIME_DISPLAY_STATE;
  timeDisplayState = winampDisplayDataBuffer[currentOffset];
  currentOffset = OFFSET_SAMPLE_RATE_KHZ;
  sampleRateKhz = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;
  currentOffset = OFFSET_SAMPLE_RATE_HZ;
  sampleRateHz = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;

  currentOffset = OFFSET_EQ_70HZ;
  eq70Hz = winampDisplayDataBuffer[currentOffset];
  currentOffset = OFFSET_EQ_180HZ;
  eq180Hz = winampDisplayDataBuffer[currentOffset];
  currentOffset = OFFSET_EQ_320HZ;
  eq320Hz = winampDisplayDataBuffer[currentOffset];
  currentOffset = OFFSET_EQ_600HZ;
  eq600Hz = winampDisplayDataBuffer[currentOffset];
  currentOffset = OFFSET_EQ_1KHZ;
  eq1Khz = winampDisplayDataBuffer[currentOffset];
  currentOffset = OFFSET_EQ_3KHZ;
  eq3Khz = winampDisplayDataBuffer[currentOffset];
  currentOffset = OFFSET_EQ_6KHZ;
  eq6Khz = winampDisplayDataBuffer[currentOffset];
  currentOffset = OFFSET_EQ_12KHZ;
  eq12Khz = winampDisplayDataBuffer[currentOffset];
  currentOffset = OFFSET_EQ_14KHZ;
  eq14Khz = winampDisplayDataBuffer[currentOffset];
  currentOffset = OFFSET_EQ_16KHZ;
  eq16Khz = winampDisplayDataBuffer[currentOffset];

  currentOffset = OFFSET_SONG_TITLE_ASCII_STRING_LENGTH;
  songTitleAsciiStringLength = (int32_t)winampDisplayDataBuffer[currentOffset] | (int32_t)winampDisplayDataBuffer[currentOffset + 1] << 8 | (int32_t)winampDisplayDataBuffer[currentOffset + 2] << 16 | (int32_t)winampDisplayDataBuffer[currentOffset + 3] << 24;
  currentOffset = OFFSET_SONG_TITLE_ASCII_STRING;
  if (songTitleAsciiStringLength > 0) {
    for (uint32_t songTitleAsciiStringLengthIndex = 0UL; songTitleAsciiStringLengthIndex < songTitleAsciiStringLength; songTitleAsciiStringLengthIndex++) {
      songTitleAsciiString[songTitleAsciiStringLengthIndex] = winampDisplayDataBuffer[currentOffset + songTitleAsciiStringLengthIndex];
    }
    songTitleAsciiString[songTitleAsciiStringLength] = '\0';  // Put a terminator at the end of the string
  }
  if (songTitleAsciiStringLength <= 0) {
    songTitleAsciiString[0] = 'W';
    songTitleAsciiString[1] = 'i';
    songTitleAsciiString[2] = 'n';
    songTitleAsciiString[3] = 'a';
    songTitleAsciiString[4] = 'm';
    songTitleAsciiString[5] = 'p';
    songTitleAsciiString[6] = '\0';
    songTitleAsciiStringLength = 6UL;
  }

  if (audioChannels > 0) {
    if (visualizerState == 1) {
      currentOffset = OFFSET_SPECTRUM_ANALYZER_START;
      for (uint32_t spectrumAnalyzerRawIndex = 0UL; spectrumAnalyzerRawIndex < sizeof(spectrumAnalyzerRaw); spectrumAnalyzerRawIndex++) {
        uint32_t spectrumAnalyzerRawIndexDiv2 = spectrumAnalyzerRawIndex / 2;
        uint32_t spectrumAnalyzerRawIndexMod2 = spectrumAnalyzerRawIndex % 2;
        spectrumAnalyzerRaw[spectrumAnalyzerRawIndex] = winampDisplayDataBuffer[currentOffset + spectrumAnalyzerRawIndex];
        if (spectrumAnalyzerRawIndexMod2 % 2 == 0) {
          spectrumAnalyzer[spectrumAnalyzerRawIndexDiv2] = spectrumAnalyzerRaw[spectrumAnalyzerRawIndex];
        }
        if (spectrumAnalyzerRawIndexMod2 % 2 == 1) {
          spectrumAnalyzerPeak[spectrumAnalyzerRawIndexDiv2] = spectrumAnalyzerRaw[spectrumAnalyzerRawIndex];
        }
      }
    }
  }
}

void drawWinampOled() {
  u8g2.clearBuffer();  // clear the internal memory

  //songTitleXPos = 47;
  uint8_t songTitleYPos = 8;
  uint8_t songTitleHideW = 46;
  uint8_t songTitleRoomFor = 16;  // Amount of characters the display can fit for song title using those coordinates and fonts
  uint8_t characterWidth = 5;
  uint8_t spaceBetweenLoopStrings = 3;  // Spacing is amount of characters, not pixels

  u8g2.setFont(u8g2_font_5x7_tf);
  //u8g2.setFont(u8g2_font_micro_tr);
  if (songTitleAsciiStringLength > 0) {
    int32_t songTitleStringLengthPixels = characterWidth * songTitleAsciiStringLength;                                    // String length in pixels using the font u8g2_font_5x7_tf
    int32_t songTitleXPos2 = (songTitleXPos + songTitleStringLengthPixels) + (characterWidth * spaceBetweenLoopStrings);  // Position of second string used to give the illusion of infinite scrolling text
    /*
    if (audioChannels <= 0) {
      songTitleXPos = 47;
    }
    */
    if (songTitleAsciiStringLength != songTitleAsciiStringLengthPrevious) {
      songTitleXPos = 47;
    }
    if (songTitleXPos2 <= 47) {
      songTitleXPos = 47;
    }
    if (songTitleAsciiStringLength <= songTitleRoomFor) {
      // Do not scroll the text
      songTitleXPos = 47;
      songTitleStringLengthPixels = characterWidth * songTitleAsciiStringLength;                                    // String length in pixels using the font u8g2_font_5x7_tf
      songTitleXPos2 = (songTitleXPos + songTitleStringLengthPixels) + (characterWidth * spaceBetweenLoopStrings);  // Position of second string used to give the illusion of infinite scrolling text
      u8g2.drawStr(songTitleXPos, songTitleYPos, songTitleAsciiString);
      //u8g2.drawStr(songTitleXPos2, songTitleYPos, songTitleAsciiString);
    }
    /*
    if (audioChannels <= 0) {
      songTitleXPos = 47;
    }
    */
    if (songTitleAsciiStringLength != songTitleAsciiStringLengthPrevious) {
      songTitleXPos = 47;
    }
    if (songTitleXPos2 <= 47) {
      songTitleXPos = 47;
    }
    if (songTitleAsciiStringLength > songTitleRoomFor) {
      // Scroll needed
      songTitleXPos--;
      songTitleStringLengthPixels = characterWidth * songTitleAsciiStringLength;                                    // String length in pixels using the font u8g2_font_5x7_tf
      songTitleXPos2 = (songTitleXPos + songTitleStringLengthPixels) + (characterWidth * spaceBetweenLoopStrings);  // Position of second string used to give the illusion of infinite scrolling text
      u8g2.drawStr(songTitleXPos, songTitleYPos, songTitleAsciiString);
      u8g2.drawStr(songTitleXPos2, songTitleYPos, songTitleAsciiString);
    }
    /*
    if (audioChannels <= 0) {
      songTitleXPos = 47;
    }
    */
    if (songTitleAsciiStringLength != songTitleAsciiStringLengthPrevious) {
      songTitleXPos = 47;
    }
    if (songTitleXPos2 <= 47) {
      songTitleXPos = 47;
    }
    songTitleAsciiStringLengthPrevious = songTitleAsciiStringLength;
    u8g2.setDrawColor(0);
    u8g2.drawBox(0, 0, songTitleHideW, songTitleYPos + 1);
    u8g2.setDrawColor(1);
    //u8g2.drawBox(songTitleXPos, songTitleYPos, 127, 8);
    //u8g2.setDrawColor(1);
  }

  uint8_t timerXPos = 6;
  uint8_t timerYPos = 10;
  if (audioChannels > 0) {
    if (timeDisplayMode <= 0) {
      // MM:SS
      if (lengthSecondsTotal > 0 && positionSecondsTotal <= lengthSecondsTotal) {
        if (timeDisplayState == 0) {
          u8g2.setFont(u8g2_font_ncenR08_tn);
          u8g2.drawStr(timerXPos, timerYPos, positionMinutesSecondsString);
        }
        if (timeDisplayState != 0) {
          u8g2.setFont(u8g2_font_ncenR08_tn);
          u8g2.drawStr(timerXPos, timerYPos, remainingMinutesSecondsString);
        }
      }
      if (lengthSecondsTotal <= 0 || positionSecondsTotal > lengthSecondsTotal) {
        u8g2.setFont(u8g2_font_ncenR08_tn);
        u8g2.drawStr(timerXPos, timerYPos, positionMinutesSecondsString);
      }
    }
    if (timeDisplayMode == 1) {
      // HH:MM:SS
      if (lengthSecondsTotal > 0 && positionSecondsTotal <= lengthSecondsTotal) {
        if (timeDisplayState == 0) {
          u8g2.setFont(u8g2_font_ncenR08_tn);
          u8g2.drawStr(timerXPos, timerYPos, positionHoursMinutesSecondsString);
        }
        if (timeDisplayState != 0) {
          u8g2.setFont(u8g2_font_ncenR08_tn);
          u8g2.drawStr(timerXPos, timerYPos, remainingHoursMinutesSecondsString);
        }
      }
      if (lengthSecondsTotal <= 0 || positionSecondsTotal > lengthSecondsTotal) {
        u8g2.setFont(u8g2_font_ncenR08_tn);
        u8g2.drawStr(timerXPos, timerYPos, positionHoursMinutesSecondsString);
      }
    }
    if (timeDisplayMode >= 2) {
      // DD:HH:MM:SS
      if (lengthSecondsTotal > 0 && positionSecondsTotal <= lengthSecondsTotal) {
        if (timeDisplayState == 0) {
          u8g2.setFont(u8g2_font_ncenR08_tn);
          u8g2.drawStr(timerXPos, timerYPos, positionDaysHoursMinutesSecondsString);
        }
        if (timeDisplayState != 0) {
          u8g2.setFont(u8g2_font_ncenR08_tn);
          u8g2.drawStr(timerXPos, timerYPos, remainingDaysHoursMinutesSecondsString);
        }
      }
      if (lengthSecondsTotal <= 0 || positionSecondsTotal > lengthSecondsTotal) {
        u8g2.setFont(u8g2_font_ncenR08_tn);
        u8g2.drawStr(timerXPos, timerYPos, positionDaysHoursMinutesSecondsString);
      }
    }
  }

  u8g2.setFont(u8g2_font_5x7_tf);

  if (audioChannels > 0) {
    if (visualizerState == 1) {
      for (uint32_t spectrumAnalyzerIndex = 0UL; spectrumAnalyzerIndex < sizeof(spectrumAnalyzer); spectrumAnalyzerIndex++) {
        uint8_t spectrumAnalyzerBarSizeCapped = map(spectrumAnalyzer[spectrumAnalyzerIndex], 0, 60, 0, 16);
        uint8_t spectrumAnalyzerPeakPosCapped = map(spectrumAnalyzerPeak[spectrumAnalyzerIndex], 0, 60, 0, 16);
        if (spectrumAnalyzerBarSizeCapped > 0) {
          u8g2.drawVLine(2 + (spectrumAnalyzerIndex * 2), 30 - spectrumAnalyzerBarSizeCapped, spectrumAnalyzerBarSizeCapped);
        }
        if (spectrumAnalyzerPeakPosCapped > 0) {
          u8g2.drawPixel(2 + (spectrumAnalyzerIndex * 2), 30 - spectrumAnalyzerPeakPosCapped);
        }
      }
    }
  }

  uint8_t bitrateKbpsXPos = 46;
  uint8_t bitrateKbpsYPos = 16;
  uint8_t sampleRateXPos = 96;
  uint8_t sampleRateYPos = 16;

  u8g2.setCursor(bitrateKbpsXPos, bitrateKbpsYPos);
  if (audioChannels > 0) {
    u8g2.setCursor(bitrateKbpsXPos, bitrateKbpsYPos);
    u8g2.print(bitrateKbps);
    u8g2.setCursor(sampleRateXPos, sampleRateYPos);
    u8g2.print(sampleRateKhz);
  }
  u8g2.drawStr(bitrateKbpsXPos + 18, bitrateKbpsYPos, "kbps     kHz");

  uint8_t monoIndicatorXPos = 71;
  uint8_t monoIndicatorYPos = 26;
  uint8_t monoIndicatorBoxW = 21;
  uint8_t monoIndicatorBoxH = 8;

  uint8_t stereoIndicatorXPos = 94;
  uint8_t stereoIndicatorYPos = 26;
  uint8_t stereoIndicatorBoxW = 31;
  uint8_t stereoIndicatorBoxH = 8;

  if (audioChannels > 0) {
    if (lengthSecondsTotal > 0) {
      if (lengthMinutesSecondsStringLength > 0) {
        u8g2.drawStr(bitrateKbpsXPos - 2, stereoIndicatorYPos, lengthMinutesSecondsString);
      }
    }
  }

  if (audioChannels <= 0) {
    u8g2.setDrawColor(1);
    u8g2.drawStr(monoIndicatorXPos, monoIndicatorYPos, "Mono");
    u8g2.setDrawColor(1);
    u8g2.drawStr(stereoIndicatorXPos, stereoIndicatorYPos, "Stereo");
  }
  if (audioChannels == 1) {
    u8g2.drawBox(monoIndicatorXPos - 1, monoIndicatorYPos - 7, monoIndicatorBoxW, monoIndicatorBoxH);
    u8g2.setDrawColor(0);
    u8g2.drawStr(monoIndicatorXPos, monoIndicatorYPos, "Mono");
    u8g2.setDrawColor(1);
    u8g2.drawStr(stereoIndicatorXPos, stereoIndicatorYPos, "Stereo");
  }
  if (audioChannels >= 2) {
    u8g2.drawStr(monoIndicatorXPos, monoIndicatorYPos, "Mono");
    u8g2.drawBox(stereoIndicatorXPos - 1, stereoIndicatorYPos - 7, stereoIndicatorBoxW, stereoIndicatorBoxH);
    u8g2.setDrawColor(0);
    u8g2.drawStr(stereoIndicatorXPos, stereoIndicatorYPos, "Stereo");
    u8g2.setDrawColor(1);
  }

  uint8_t volumePosAdjusted = map(volumeLevel, 0, 255, 0, 60);
  uint8_t volumeLevelAdjusted = map(volumeLevel, 0, 255, 0, 100);
  uint8_t volumeLevelXPos = 0;
  uint8_t volumeLevelYPos = 33;
  uint8_t volumeLevelBoxW = 61;
  uint8_t volumeLevelBoxH = 10;
  uint8_t volumeThumbH = 4;
  u8g2.drawFrame(volumeLevelXPos, volumeLevelYPos, volumeLevelBoxW, volumeLevelBoxH);
  u8g2.drawStr(volumeLevelXPos + 7, volumeLevelYPos + 8, "Volume:");
  u8g2.setCursor(volumeLevelXPos + 42, volumeLevelYPos + 8);
  u8g2.print(volumeLevelAdjusted);
  u8g2.drawBox(volumePosAdjusted, volumeLevelYPos - 1, volumeThumbH, volumeLevelBoxH + 2);

  int8_t balancePanPosAdjusted = map(balancePan, -128, 127, 65, 124);
  int8_t balancePanLevelAdjusted = map(balancePan, -128, 127, -100, 100);
  uint8_t balancePanXPos = 65;
  uint8_t balancePanYPos = 33;
  uint8_t balancePanBoxW = 61;
  uint8_t balancePanBoxH = 10;
  uint8_t balancePanThumbH = 4;
  u8g2.drawFrame(balancePanXPos, balancePanYPos, balancePanBoxW, balancePanBoxH);
  u8g2.drawStr(balancePanXPos + 2, balancePanYPos + 8, "Balance:");
  u8g2.setCursor(balancePanXPos + 42, balancePanYPos + 8);
  u8g2.print(balancePanLevelAdjusted);
  u8g2.drawBox(balancePanPosAdjusted, balancePanYPos - 1, balancePanThumbH, balancePanBoxH + 2);

  uint8_t scrubberXPos = 0;
  uint8_t scrubberYPos = 46;
  uint8_t scrubberBoxW = 30;
  uint8_t scrubberBoxH = 7;
  uint8_t scrubberBoxLineW = 24;
  u8g2.drawFrame(scrubberXPos, scrubberYPos - 1, 126, scrubberBoxH + 2);  // Spans entire display width
  if (audioChannels > 0) {
    if (lengthSecondsTotal > 0 && positionSecondsTotal <= lengthSecondsTotal) {
      uint8_t scrubberPosition = map(positionSecondsTotal, 0, lengthSecondsTotal, 0, 128 - 32);
      u8g2.drawFrame(scrubberPosition, scrubberYPos, scrubberBoxW, scrubberBoxH);
      u8g2.drawHLine(scrubberPosition + 3, scrubberYPos + 3, scrubberBoxLineW);
    }
  }

  uint8_t shuffleIndicatorXPos = 59;
  uint8_t shuffleIndicatorYPos = 56;
  uint8_t shuffleIndicatorBoxW = 36;
  uint8_t shuffleIndicatorBoxH = 8;

  if (shuffleState == 0) {
    //u8g2.drawBox(49, 56, 36, 8);
    //u8g2.setDrawColor(0);
    u8g2.drawStr(shuffleIndicatorXPos, shuffleIndicatorYPos + 7, "Shuffle");
    //u8g2.setDrawColor(1);
  }
  if (shuffleState != 0) {
    u8g2.drawBox(shuffleIndicatorXPos - 1, shuffleIndicatorYPos, shuffleIndicatorBoxW, shuffleIndicatorBoxH);
    u8g2.setDrawColor(0);
    u8g2.drawStr(shuffleIndicatorXPos, shuffleIndicatorYPos + 7, "Shuffle");
    u8g2.setDrawColor(1);
  }

  uint8_t repeatIndicatorXPos = 96;
  uint8_t repeatIndicatorYPos = 56;
  uint8_t repeatIndicatorBoxW = 31;
  uint8_t repeatIndicatorBoxH = 8;

  if (repeatState == 0) {
    //u8g2.drawBox(49, 56, 36, 8);
    //u8g2.setDrawColor(0);
    u8g2.drawStr(repeatIndicatorXPos, repeatIndicatorYPos + 7, "Repeat");
    //u8g2.setDrawColor(1);
  }
  if (repeatState != 0) {
    u8g2.drawBox(repeatIndicatorXPos - 1, repeatIndicatorYPos, repeatIndicatorBoxW, repeatIndicatorBoxH);
    u8g2.setDrawColor(0);
    u8g2.drawStr(repeatIndicatorXPos, repeatIndicatorYPos + 7, "Repeat");
    u8g2.setDrawColor(1);
  }

  //u8g2.setFont(u8g2_font_ncenB08_tr);  // choose a suitable font
  u8g2.setCursor(0, 63);
  u8g2.print(millis());  // write something to the internal memory
  u8g2.sendBuffer();     // transfer internal memory to the display
}