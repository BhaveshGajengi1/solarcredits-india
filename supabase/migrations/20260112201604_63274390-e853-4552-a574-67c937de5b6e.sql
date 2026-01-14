-- Drop the existing public select policy for marketplace_listings
DROP POLICY IF EXISTS "Anyone can view active listings" ON public.marketplace_listings;

-- Create a new policy that requires authentication to view listings
-- This protects seller_id and pricing data from anonymous users
CREATE POLICY "Authenticated users can view active listings" 
ON public.marketplace_listings 
FOR SELECT 
TO authenticated
USING (status = 'active');

-- Also allow users to see their own listings regardless of status
CREATE POLICY "Users can view their own listings" 
ON public.marketplace_listings 
FOR SELECT 
TO authenticated
USING (auth.uid() = seller_id);