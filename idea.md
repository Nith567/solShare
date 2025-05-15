WooPay Solana

Enable WooCommerce stores and marketplaces to accept Solana payments using the HTTP x402 protocol, bringing seamless payment checkout to e-commerce.


The current landscape of e-commerce payments is dominated by legacy systems that are slow, expensive, and often require unnecessary intermediaries. Traditional payment gateways charge high fees, impose settlement delays (T+2 days) and require users to register, share personal information, or use specific wallets. Even recent solana “blinks,” are limited to certain wallets like Phantom, restricting accessibility and user choice.

0x402 (see x402.org) is an open protocol for internet-native payments that solves these issues by enabling frictionless, blockchain-agnostic, and secure payments directly over HTTP. It activates the dormant HTTP 402 status code, allowing users to pay for resources. With 0x402, there are no extra fees, and payments are settled instantly—especially on fast blockchains like Solana, where transactions finalize in seconds.

Our project, WooPay Solana, brings the power of the HTTP 402 protocol to WooCommerce stores and marketplaces. Unlike existing solutions, WooPay Solana works with any Solana-compatible wallet, not just Phantom, and allows merchants to accept payments in SOL or USDC with a fixed, transparent fee structure. Merchants simply share their product URLs, and customers can pay directly—no registration or complex onboarding required.

We achieve this by integrating the x402 protocol into WooCommerce via a plugin REST API store. When a customer wants to purchase a product, they are presented with a 402 payment request. Upon payment, the order is instantly marked as complete for an orderId in the merchant store, and receives funds directly in their wallet—no intermediaries, no delays.

This approach democratizes access to fast, secure, and open payments for WooCommerce merchants and their customers, making blockchain-native commerce as simple as sharing a QRcode/Link



By the end of the project, we will deliver a fully functional integration of the HTTP x402 protocol into WooCommerce, enabling merchants to accept fast, secure, and direct Solana payments for their products. This solution will allow any WooCommerce store to offer blockchain-native checkout experiences, with instant settlement and no intermediaries, using any Solana-compatible wallet. The process will be seamless for both merchants and customers, requiring no registration or complex setup, and will demonstrate the power and simplicity of open, internet-native payments.



The project will be considered successful when WooCommerce stores process a meaningful volume of real customer payments via Solana using the 402 protocol, demonstrating adoption and usability of blockchain-native checkout.
