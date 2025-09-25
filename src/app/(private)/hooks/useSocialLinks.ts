import { useState, useEffect } from "react";
import { supabase } from "@/app/(private)/lib/supa-client-init";
import type { SocialLink, SocialPlatform } from "@/app/(private)/types";
import { v4 as uuidv4 } from "uuid";

export const useSocialLinks = (userId?: string) => {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadSocialLinks();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const loadSocialLinks = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("profiles")
        .select("social_links")
        .eq("user_id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          setLinks([]);
          return;
        }
        throw error;
      }

      const socialLinks = data?.social_links || [];
      setLinks(Array.isArray(socialLinks) ? socialLinks : []);
    } catch (error) {
      console.error("Error loading social links:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load social links"
      );
      setLinks([]);
    } finally {
      setLoading(false);
    }
  };

  const updateSocialLinksInDB = async (newLinks: SocialLink[]) => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          social_links: newLinks,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error updating social links in DB:", error);
      throw error;
    }
  };

  const addLink = async (platform: SocialPlatform, url: string) => {
    if (!userId) return null;

    const newLink: SocialLink = {
      id: uuidv4(),
      platform,
      url,
      order: links.length,
    };

    const newLinks = [...links, newLink];

    try {
      await updateSocialLinksInDB(newLinks);
      setLinks(newLinks);
      return newLink;
    } catch (error) {
      console.error("Error adding social link:", error);
      return null;
    }
  };

  const updateLink = async (id: string, updates: Partial<SocialLink>) => {
    const newLinks = links.map((link) =>
      link.id === id ? { ...link, ...updates } : link
    );

    try {
      await updateSocialLinksInDB(newLinks);
      setLinks(newLinks);
    } catch (error) {
      console.error("Error updating social link:", error);
    }
  };

  const deleteLink = async (id: string) => {
    const newLinks = links
      .filter((link) => link.id !== id)
      .map((link, index) => ({ ...link, order: index }));

    try {
      await updateSocialLinksInDB(newLinks);
      setLinks(newLinks);
    } catch (error) {
      console.error("Error deleting social link:", error);
    }
  };

  const reorderLinks = async (newOrder: SocialLink[]) => {
    const reorderedLinks = newOrder.map((link, index) => ({
      ...link,
      order: index,
    }));

    try {
      await updateSocialLinksInDB(reorderedLinks);
      setLinks(reorderedLinks);
    } catch (error) {
      console.error("Error reordering links:", error);
    }
  };

  return {
    links,
    loading,
    error,
    addLink,
    updateLink,
    deleteLink,
    reorderLinks,
    refetch: loadSocialLinks,
  };
};
